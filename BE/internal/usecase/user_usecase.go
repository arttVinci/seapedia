package usecase

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
)

// UserUseCase berisi logika bisnis untuk autentikasi pengguna: register,
// login, dan logout.
type UserUseCase struct {
	DB                     *gorm.DB
	Log                    *logrus.Logger
	Validate               *validator.Validate
	Viper                  *viper.Viper
	UserRepository         *repository.UserRepository
	UserRoleRepository     *repository.UserRoleRepository
	RevokedTokenRepository *repository.RevokedTokenRepository
}

// NewUserUseCase membuat instance UserUseCase baru.
func NewUserUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	validate *validator.Validate,
	viper *viper.Viper,
	userRepository *repository.UserRepository,
	userRoleRepository *repository.UserRoleRepository,
	revokedTokenRepository *repository.RevokedTokenRepository,
) *UserUseCase {
	return &UserUseCase{
		DB:                     db,
		Log:                    log,
		Validate:               validate,
		Viper:                  viper,
		UserRepository:         userRepository,
		UserRoleRepository:     userRoleRepository,
		RevokedTokenRepository: revokedTokenRepository,
	}
}

// Register mendaftarkan pengguna baru. Password di-hash dengan bcrypt, lalu
// user dan role-nya disimpan dalam satu transaksi (atomic). Role default
// adalah "buyer" jika tidak disertakan.
func (c *UserUseCase) Register(ctx context.Context, request *model.RegisterUserRequest) (*model.RegisterUserResponse, error) {
	tx := c.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	if err := c.Validate.Struct(request); err != nil {
		c.Log.Warnf("Invalid request body : %+v", err)
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	// Cek duplikasi username
	existingUser := new(entity.User)
	if err := c.UserRepository.FindByUsername(tx, existingUser, request.Username); err == nil {
		c.Log.Warnf("Username already exists : %s", request.Username)
		return nil, fiber.NewError(fiber.StatusConflict, "Username sudah digunakan")
	} else if err != gorm.ErrRecordNotFound {
		c.Log.Warnf("Failed to check username : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan")
	}

	// Cek duplikasi email
	existingEmail := new(entity.User)
	if err := c.UserRepository.FindByEmail(tx, existingEmail, request.Email); err == nil {
		c.Log.Warnf("Email already exists : %s", request.Email)
		return nil, fiber.NewError(fiber.StatusConflict, "Email sudah digunakan")
	} else if err != gorm.ErrRecordNotFound {
		c.Log.Warnf("Failed to check email : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan")
	}

	// Hash password dengan bcrypt
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		c.Log.Warnf("Failed to hash password : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan")
	}

	// Tentukan role; default buyer
	role := request.Role
	if role == "" {
		role = "buyer"
	}

	// Buat user
	user := &entity.User{
		ID:           uuid.NewString(),
		Username:     request.Username,
		Email:        request.Email,
		Password:     string(hashedPassword),
		AuthProvider: "local",
		IsAdmin:      false,
	}

	if err := c.UserRepository.Create(tx, user); err != nil {
		c.Log.Warnf("Failed to create user : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan")
	}

	// Simpan role user dalam transaksi yang sama
	userRole := &entity.UserRole{
		ID:     uuid.NewString(),
		UserID: user.ID,
		Role:   role,
	}

	if err := c.UserRoleRepository.Create(tx, userRole); err != nil {
		c.Log.Warnf("Failed to create user role : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan")
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.Warnf("Failed to commit transaction : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan")
	}

	return &model.RegisterUserResponse{
		User: *converter.UserToResponse(user),
	}, nil
}
