package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"

	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

// UserController adalah HTTP handler untuk modul autentikasi: register,
// login, dan logout.
type UserController struct {
	UserUseCase *usecase.UserUseCase
	Log         *logrus.Logger
}

// NewUserController membuat instance UserController baru.
func NewUserController(userUseCase *usecase.UserUseCase, log *logrus.Logger) *UserController {
	return &UserController{
		UserUseCase: userUseCase,
		Log:         log,
	}
}

// Register menangani pendaftaran pengguna baru (Tamu).
// Endpoint: POST /api/users
func (c *UserController) Register(ctx *fiber.Ctx) error {
	request := new(model.RegisterUserRequest)
	err := ctx.BodyParser(request)
	if err != nil {
		c.Log.Warnf("Failed to parse request body : %+v", err)
		return fiber.NewError(fiber.StatusBadRequest, "Format data request tidak valid")
	}

	response, err := c.UserUseCase.Register(ctx.UserContext(), request)
	if err != nil {
		c.Log.Warnf("Failed to register user : %+v", err)
		return err
	}

	return ctx.JSON(model.WebResponse[*model.RegisterUserResponse]{
		Data:    response,
		Message: "Registrasi berhasil",
		Success: true,
	})
}

// Login menangani login pengguna dan penerbitan access token (Tamu).
// Endpoint: POST /api/users/_login
func (c *UserController) Login(ctx *fiber.Ctx) error {
	request := new(model.LoginUserRequest)
	err := ctx.BodyParser(request)
	if err != nil {
		c.Log.Warnf("Failed to parse request body : %+v", err)
		return fiber.NewError(fiber.StatusBadRequest, "Format data request tidak valid")
	}

	response, err := c.UserUseCase.Login(ctx.UserContext(), request)
	if err != nil {
		c.Log.Warnf("Failed to login user : %+v", err)
		return err
	}

	return ctx.JSON(model.WebResponse[*model.LoginUserResponse]{
		Data:    response,
		Message: "Login berhasil",
		Success: true,
	})
}

// Logout menangani logout pengguna dengan mencabut token (Token).
// Endpoint: POST /api/users/_logout
func (c *UserController) Logout(ctx *fiber.Ctx) error {
	authModel := middleware.GetUser(ctx)

	response, err := c.UserUseCase.Logout(ctx.UserContext(), authModel)
	if err != nil {
		c.Log.Warnf("Failed to logout user : %+v", err)
		return err
	}

	return ctx.JSON(model.WebResponse[*model.LogoutUserResponse]{
		Data:    response,
		Message: "Logout berhasil",
		Success: true,
	})
}
