package usecase

import (
	"context"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"github.com/traa/seapedia/server/internal/auth"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserUseCase struct {
	DB                     *gorm.DB
	Log                    *logrus.Logger
	Validate               *validator.Validate
	Config                 *viper.Viper
	UserRepository         *repository.UserRepository
	UserRoleRepository     *repository.UserRoleRepository
	RevokedTokenRepository *repository.RevokedTokenRepository
	StoreRepository        *repository.StoreRepository
}

func NewUserUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	validate *validator.Validate,
	config *viper.Viper,
	userRepository *repository.UserRepository,
	userRoleRepository *repository.UserRoleRepository,
	revokedTokenRepository *repository.RevokedTokenRepository,
	storeRepository *repository.StoreRepository,
) *UserUseCase {
	return &UserUseCase{
		DB:                     db,
		Log:                    log,
		Validate:               validate,
		Config:                 config,
		UserRepository:         userRepository,
		UserRoleRepository:     userRoleRepository,
		RevokedTokenRepository: revokedTokenRepository,
		StoreRepository:        storeRepository,
	}
}

func (c *UserUseCase) Register(ctx context.Context, request *model.RegisterUserRequest) (*model.RegisterUserResponse, error) {
	tx := c.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	err := c.Validate.Struct(request)
	if err != nil {
		c.Log.Warnf("Invalid request body : %+v", err)
		return nil, model.ErrValidation
	}

	user := new(entity.User)
	err = c.UserRepository.FindByUsername(tx, user, request.Username)
	if err == nil {
		c.Log.Warnf("Username already exists : %+v", request.Username)
		return nil, model.ErrConflict
	}

	err = c.UserRepository.FindByEmail(tx, user, request.Email)
	if err == nil {
		c.Log.Warnf("Email already exists : %+v", request.Email)
		return nil, model.ErrConflict
	}

	password, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		c.Log.Warnf("Failed to generate password : %+v", err)
		return nil, err
	}

	user = &entity.User{
		ID:           uuid.NewString(),
		Username:     request.Username,
		Email:        request.Email,
		Password:     string(password),
		AuthProvider: "local",
		IsAdmin:      false,
	}

	err = c.UserRepository.Create(tx, user)
	if err != nil {
		c.Log.Warnf("Failed create user : %+v", err)
		return nil, err
	}

	role := request.Role
	if role == "" {
		role = "buyer"
	}

	userRole := &entity.UserRole{
		ID:     uuid.NewString(),
		UserID: user.ID,
		Role:   role,
	}

	err = c.UserRoleRepository.Create(tx, userRole)
	if err != nil {
		c.Log.Warnf("Failed create user role : %+v", err)
		return nil, err
	}

	// Jika role seller, langsung buatkan toko
	if role == "seller" {
		store := &entity.Store{
			ID:          uuid.NewString(),
			UserID:      user.ID,
			Name:        "Toko " + request.Username,
			Description: "Toko milik " + request.Username,
		}
		if err := c.StoreRepository.Create(tx, store); err != nil {
			c.Log.Warnf("Failed create store for seller : %+v", err)
			return nil, err
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, err
	}

	return &model.RegisterUserResponse{
		User: *converter.UserToResponse(user),
	}, nil
}

func (c *UserUseCase) Login(ctx context.Context, request *model.LoginUserRequest) (*model.LoginUserResponse, error) {
	tx := c.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	err := c.Validate.Struct(request)
	if err != nil {
		c.Log.Warnf("Invalid request body : %+v", err)
		return nil, model.ErrValidation
	}

	user := new(entity.User)
	err = c.UserRepository.FindByEmail(tx, user, request.Email)
	if err != nil {
		c.Log.Warnf("Failed find user by email : %+v", err)
		return nil, model.ErrNotFound
	}

	if user.AuthProvider != "local" {
		c.Log.Warnf("User registered via third party : %+v", user.AuthProvider)
		return nil, model.ErrUnauthorized
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(request.Password))
	if err != nil {
		c.Log.Warnf("Failed to compare password : %+v", err)
		return nil, model.ErrNotFound
	}

	secret := c.Config.GetString("jwt.secret")
	expiredHours := c.Config.GetInt("jwt.expired")

	token, err := auth.GenerateJWT(secret, user.ID, user.Username, "", expiredHours)
	if err != nil {
		c.Log.Warnf("Failed to generate JWT : %+v", err)
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, err
	}

	return &model.LoginUserResponse{
		User:  *converter.UserToResponse(user),
		Token: token,
	}, nil
}

func (c *UserUseCase) Logout(ctx context.Context, authModel *model.Auth) (*model.LogoutUserResponse, error) {
	tx := c.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	expiredAt := time.Unix(authModel.Exp, 0).UnixMilli()

	revokedToken := &entity.RevokedToken{
		JTI:       authModel.JTI,
		ExpiredAt: expiredAt,
	}

	err := c.RevokedTokenRepository.Create(tx, revokedToken)
	if err != nil {
		c.Log.Warnf("Failed to create revoked token : %+v", err)
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, err
	}

	return nil, nil
}

func (c *UserUseCase) Roles(ctx context.Context, authModel *model.Auth) (*model.RolesResponse, error) {
	tx := c.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	user := new(entity.User)
	err := c.UserRepository.FindById(tx, user, authModel.ID)
	if err != nil {
		c.Log.Warnf("Failed find user by id : %+v", err)
		return nil, model.ErrNotFound
	}

	var userRoles []entity.UserRole
	err = c.UserRoleRepository.FindByUserID(tx, &userRoles, authModel.ID)
	if err != nil {
		c.Log.Warnf("Failed find user roles : %+v", err)
		return nil, err
	}

	var roles []string
	for _, userRole := range userRoles {
		roles = append(roles, userRole.Role)
	}

	if user.IsAdmin {
		roles = append(roles, "admin")
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, err
	}

	return &model.RolesResponse{
		Roles: roles,
	}, nil
}

func (c *UserUseCase) SelectRole(ctx context.Context, authModel *model.Auth, request *model.SelectRoleRequest) (*model.SelectRoleResponse, error) {
	tx := c.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	err := c.Validate.Struct(request)
	if err != nil {
		c.Log.Warnf("Invalid request body : %+v", err)
		return nil, model.ErrValidation
	}

	user := new(entity.User)
	err = c.UserRepository.FindById(tx, user, authModel.ID)
	if err != nil {
		c.Log.Warnf("Failed find user by id : %+v", err)
		return nil, model.ErrNotFound
	}

	var userRoles []entity.UserRole
	err = c.UserRoleRepository.FindByUserID(tx, &userRoles, authModel.ID)
	if err != nil {
		c.Log.Warnf("Failed find user roles : %+v", err)
		return nil, err
	}

	isValidRole := false
	if request.Role == "admin" {
		if user.IsAdmin {
			isValidRole = true
		}
	} else {
		for _, userRole := range userRoles {
			if userRole.Role == request.Role {
				isValidRole = true
				break
			}
		}
	}

	if !isValidRole {
		c.Log.Warnf("Role not owned : %+v", request.Role)
		return nil, model.ErrForbidden
	}

	secret := c.Config.GetString("jwt.secret")
	expiredHours := c.Config.GetInt("jwt.expired")

	token, err := auth.GenerateJWT(secret, user.ID, user.Username, request.Role, expiredHours)
	if err != nil {
		c.Log.Warnf("Failed to generate JWT : %+v", err)
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, err
	}

	return &model.SelectRoleResponse{
		Token:      token,
		ActiveRole: request.Role,
	}, nil
}

func (c *UserUseCase) Current(ctx context.Context, authModel *model.Auth) (*model.CurrentResponse, error) {
	tx := c.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	user := new(entity.User)
	err := c.UserRepository.FindById(tx, user, authModel.ID)
	if err != nil {
		c.Log.Warnf("Failed find user by id : %+v", err)
		return nil, model.ErrNotFound
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, err
	}

	return converter.UserToCurrentResponse(user, authModel.ActiveRole), nil
}

func (c *UserUseCase) AddRole(ctx context.Context, authModel *model.Auth, request *model.AddRoleRequest) (*model.AddRoleResponse, error) {
	tx := c.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	err := c.Validate.Struct(request)
	if err != nil {
		c.Log.Warnf("Invalid request body : %+v", err)
		return nil, model.ErrValidation
	}

	user := new(entity.User)
	err = c.UserRepository.FindById(tx, user, authModel.ID)
	if err != nil {
		c.Log.Warnf("Failed find user by id : %+v", err)
		return nil, model.ErrNotFound
	}

	var userRoles []entity.UserRole
	err = c.UserRoleRepository.FindByUserID(tx, &userRoles, authModel.ID)
	if err != nil {
		c.Log.Warnf("Failed find user roles : %+v", err)
		return nil, err
	}

	// Cek apakah role sudah dimiliki
	for _, ur := range userRoles {
		if ur.Role == request.Role {
			c.Log.Warnf("Role already owned : %+v", request.Role)
			return nil, model.ErrConflict
		}
	}

	userRole := &entity.UserRole{
		ID:     uuid.NewString(),
		UserID: user.ID,
		Role:   request.Role,
	}

	err = c.UserRoleRepository.Create(tx, userRole)
	if err != nil {
		c.Log.Warnf("Failed create user role : %+v", err)
		return nil, err
	}

	// Jika role seller, langsung buatkan toko
	if request.Role == "seller" {
		store := &entity.Store{
			ID:          uuid.NewString(),
			UserID:      user.ID,
			Name:        "Toko " + user.Username,
			Description: "Toko milik " + user.Username,
		}
		if err := c.StoreRepository.Create(tx, store); err != nil {
			c.Log.Warnf("Failed create store for seller : %+v", err)
			return nil, err
		}
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, err
	}

	return &model.AddRoleResponse{
		Role: request.Role,
	}, nil
}

