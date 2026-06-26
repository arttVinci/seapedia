package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"gorm.io/gorm"

	"github.com/traa/seapedia/server/internal/delivery/http/route"
)

type BootstrapConfig struct {
	App              *fiber.App
	DB               *gorm.DB
	Config           *viper.Viper
	Log              *logrus.Logger
	Validate         *validator.Validate
}

func Bootstrap(config *BootstrapConfig) {
	//Setup Repository
	// userRepository := repository.NewUserRepository(config.Log)
	

	//Setup UseCase
	// userUseCase := usecase.NewUserUseCase(config.DB, config.Log, config.Validate, userRepository, emailVerificationRepository, config.Config, resend)
	

	//Setup Controller
	// userController := controller.NewUserController(userUseCase, config.Log)

	//Setup Middleware
	// authMiddleware := middleware.AuthMiddleware(config.Config)

	routeConfig := route.RouteConfig{
		App:                   config.App,
		// AuthMiddleware:        authMiddleware,
		// UserController:        userController,
	}
	routeConfig.Setup()
}
