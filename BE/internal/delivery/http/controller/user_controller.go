package controller

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type UserController struct {
	UserUseCase *usecase.UserUseCase
	Log         *logrus.Logger
}

func NewUserController(userUseCase *usecase.UserUseCase, log *logrus.Logger) *UserController {
	return &UserController{
		UserUseCase: userUseCase,
		Log:         log,
	}
}

// @Summary      Register a new user
// @Description  Create a new user account with a specific role
// @Tags         Users
// @Accept       json
// @Produce      json
// @Param        request body model.RegisterUserRequest true "Registration data"
// @Success      201  {object}  model.WebResponse[model.RegisterUserResponse]
// @Failure      400  {object}  model.ApiErrorResponse
// @Failure      409  {object}  model.ApiErrorResponse
// @Router       /api/users [post]
func (c *UserController) Register(ctx *fiber.Ctx) error {
	request := new(model.RegisterUserRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body: %+v", err)
		return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
			Message:    "Invalid request body",
			StatusCode: fiber.StatusBadRequest,
		})
	}

	response, err := c.UserUseCase.Register(ctx.UserContext(), request)
	if err != nil {
		if errors.Is(err, model.ErrValidation) {
			return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
				Message:    "Validation Error",
				StatusCode: fiber.StatusBadRequest,
			})
		}
		if errors.Is(err, model.ErrConflict) {
			return ctx.Status(fiber.StatusConflict).JSON(model.ApiErrorResponse{
				Message:    "Username atau email sudah digunakan",
				StatusCode: fiber.StatusConflict,
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			Message:    "Internal Server Error",
			StatusCode: fiber.StatusInternalServerError,
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(model.WebResponse[*model.RegisterUserResponse]{
		Data:    response,
		Message: "User registered successfully",
		Success: true,
	})
}

// @Summary      Login user
// @Description  Authenticate user and return JWT
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        request body model.LoginUserRequest true "Login credentials"
// @Success      200  {object}  model.WebResponse[model.LoginUserResponse]
// @Failure      400  {object}  model.ApiErrorResponse
// @Failure      401  {object}  model.ApiErrorResponse
// @Router       /api/users/_login [post]
func (c *UserController) Login(ctx *fiber.Ctx) error {
	request := new(model.LoginUserRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body: %+v", err)
		return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
			Message:    "Invalid request body",
			StatusCode: fiber.StatusBadRequest,
		})
	}

	response, err := c.UserUseCase.Login(ctx.UserContext(), request)
	if err != nil {
		if errors.Is(err, model.ErrValidation) {
			return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
				Message:    "Validation Error",
				StatusCode: fiber.StatusBadRequest,
			})
		}
		if errors.Is(err, model.ErrNotFound) {
			return ctx.Status(fiber.StatusNotFound).JSON(model.ApiErrorResponse{
				Message:    "Username atau password anda salah",
				StatusCode: fiber.StatusNotFound,
			})
		}
		if errors.Is(err, model.ErrUnauthorized) {
			return ctx.Status(fiber.StatusUnauthorized).JSON(model.ApiErrorResponse{
				Message:    "Akun ini terdaftar via Google, silahkan login menggunakan Google",
				StatusCode: fiber.StatusUnauthorized,
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			Message:    "Internal Server Error",
			StatusCode: fiber.StatusInternalServerError,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.LoginUserResponse]{
		Data:    response,
		Message: "Login successful",
		Success: true,
	})
}

// @Summary      Logout
// @Description  Revoke the current JWT session
// @Tags         Auth
// @Produce      json
// @Success      200  {object}  model.WebResponse[model.LogoutUserResponse]
// @Failure      401  {object}  model.ApiErrorResponse
// @Security     BearerAuth
// @Router       /api/users/_logout [post]
func (c *UserController) Logout(ctx *fiber.Ctx) error {
	authModel := middleware.GetUser(ctx)

	_, err := c.UserUseCase.Logout(ctx.UserContext(), authModel)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			Message:    "Internal Server Error",
			StatusCode: fiber.StatusInternalServerError,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[any]{
		Data:    nil,
		Message: "Logout successful",
		Success: true,
	})
}

// @Summary      Get User Roles
// @Description  Get available roles for the current user
// @Tags         Auth
// @Produce      json
// @Security     BearerAuth
// @Router       /api/users/_roles [get]
func (c *UserController) Roles(ctx *fiber.Ctx) error {
	authModel := middleware.GetUser(ctx)

	response, err := c.UserUseCase.Roles(ctx.UserContext(), authModel)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			return ctx.Status(fiber.StatusNotFound).JSON(model.ApiErrorResponse{
				Message:    "User not found",
				StatusCode: fiber.StatusNotFound,
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			Message:    "Internal Server Error",
			StatusCode: fiber.StatusInternalServerError,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.RolesResponse]{
		Data:    response,
		Message: "Roles retrieved successfully",
		Success: true,
	})
}

// @Summary      Select Role
// @Description  Switch active role and receive a new JWT
// @Tags         Auth
// @Accept       json
// @Produce      json
// @Param        request body model.SelectRoleRequest true "Role selection"
// @Success      200  {object}  model.WebResponse[model.SelectRoleResponse]
// @Failure      401  {object}  model.ApiErrorResponse
// @Security     BearerAuth
// @Router       /api/users/_select-role [post]
func (c *UserController) SelectRole(ctx *fiber.Ctx) error {
	authModel := middleware.GetUser(ctx)

	request := new(model.SelectRoleRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body: %+v", err)
		return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
			Message:    "Invalid request body",
			StatusCode: fiber.StatusBadRequest,
		})
	}

	response, err := c.UserUseCase.SelectRole(ctx.UserContext(), authModel, request)
	if err != nil {
		if errors.Is(err, model.ErrValidation) {
			return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
				Message:    "Validation Error",
				StatusCode: fiber.StatusBadRequest,
			})
		}
		if errors.Is(err, model.ErrNotFound) {
			return ctx.Status(fiber.StatusNotFound).JSON(model.ApiErrorResponse{
				Message:    "User not found",
				StatusCode: fiber.StatusNotFound,
			})
		}
		if errors.Is(err, model.ErrForbidden) {
			return ctx.Status(fiber.StatusForbidden).JSON(model.ApiErrorResponse{
				Message:    "Peran tidak dimiliki",
				StatusCode: fiber.StatusForbidden,
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			Message:    "Internal Server Error",
			StatusCode: fiber.StatusInternalServerError,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.SelectRoleResponse]{
		Data:    response,
		Message: "Role selected successfully",
		Success: true,
	})
}

// @Summary      Get current user
// @Description  Ambil data user yang sedang login
// @Tags         Auth
// @Produce      json
// @Success      200  {object}  model.WebResponse[model.UserResponse]
// @Failure      401  {object}  model.ApiErrorResponse
// @Security     BearerAuth
// @Router       /api/users/_current [get]
func (c *UserController) Current(ctx *fiber.Ctx) error {
	authModel := middleware.GetUser(ctx)

	response, err := c.UserUseCase.Current(ctx.UserContext(), authModel)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			return ctx.Status(fiber.StatusNotFound).JSON(model.ApiErrorResponse{
				Message:    "User not found",
				StatusCode: fiber.StatusNotFound,
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			Message:    "Internal Server Error",
			StatusCode: fiber.StatusInternalServerError,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.CurrentResponse]{
		Data:    response,
		Message: "Current user retrieved successfully",
		Success: true,
	})
}

// @Summary      Add User Role
// @Description  Add a new role to the current user
// @Tags         Users
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Router       /api/users/_add-role [post]
func (c *UserController) AddRole(ctx *fiber.Ctx) error {
	authModel := middleware.GetUser(ctx)

	request := new(model.AddRoleRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body: %+v", err)
		return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
			Message:    "Invalid request body",
			StatusCode: fiber.StatusBadRequest,
		})
	}

	response, err := c.UserUseCase.AddRole(ctx.UserContext(), authModel, request)
	if err != nil {
		if errors.Is(err, model.ErrValidation) {
			return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
				Message:    "Validation Error",
				StatusCode: fiber.StatusBadRequest,
			})
		}
		if errors.Is(err, model.ErrNotFound) {
			return ctx.Status(fiber.StatusNotFound).JSON(model.ApiErrorResponse{
				Message:    "User not found",
				StatusCode: fiber.StatusNotFound,
			})
		}
		if errors.Is(err, model.ErrConflict) {
			return ctx.Status(fiber.StatusConflict).JSON(model.ApiErrorResponse{
				Message:    "Role already exists",
				StatusCode: fiber.StatusConflict,
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			Message:    "Internal Server Error",
			StatusCode: fiber.StatusInternalServerError,
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(model.WebResponse[*model.AddRoleResponse]{
		Data:    response,
		Message: "Role added successfully",
		Success: true,
	})
}

// @Summary      Update User Profile
// @Description  Update the current user's profile
// @Tags         Users
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Router       /api/users/_profile [put]
func (c *UserController) UpdateProfile(ctx *fiber.Ctx) error {
	authModel := middleware.GetUser(ctx)

	request := new(model.UpdateUserRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body: %+v", err)
		return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
			Message:    "Invalid request body",
			StatusCode: fiber.StatusBadRequest,
		})
	}

	response, err := c.UserUseCase.UpdateProfile(ctx.UserContext(), authModel, request)
	if err != nil {
		if errors.Is(err, model.ErrValidation) {
			return ctx.Status(fiber.StatusBadRequest).JSON(model.ApiErrorResponse{
				Message:    "Validation Error",
				StatusCode: fiber.StatusBadRequest,
			})
		}
		if errors.Is(err, model.ErrNotFound) {
			return ctx.Status(fiber.StatusNotFound).JSON(model.ApiErrorResponse{
				Message:    "User not found",
				StatusCode: fiber.StatusNotFound,
			})
		}
		if errors.Is(err, model.ErrConflict) {
			return ctx.Status(fiber.StatusConflict).JSON(model.ApiErrorResponse{
				Message:    "Username atau email sudah digunakan",
				StatusCode: fiber.StatusConflict,
			})
		}
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			Message:    "Internal Server Error",
			StatusCode: fiber.StatusInternalServerError,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.UserResponse]{
		Data:    response,
		Message: "Profile updated successfully",
		Success: true,
	})
}
