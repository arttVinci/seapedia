package config

import (
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"gorm.io/gorm"

	"github.com/traa/seapedia/server/internal/delivery/http/controller"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/delivery/http/route"
	"github.com/traa/seapedia/server/internal/repository"
	"github.com/traa/seapedia/server/internal/usecase"
)

type BootstrapConfig struct {
	App      *fiber.App
	DB       *gorm.DB
	Config   *viper.Viper
	Log      *logrus.Logger
	Validate *validator.Validate
}

func Bootstrap(config *BootstrapConfig) {
	// Setup Repository
	userRepository := repository.NewUserRepository(config.Log)
	userRoleRepository := repository.NewUserRoleRepository(config.Log)
	revokedTokenRepository := repository.NewRevokedTokenRepository(config.Log)

	// Setup UseCase
	userUseCase := usecase.NewUserUseCase(
		config.DB,
		config.Log,
		config.Validate,
		config.Config,
		userRepository,
		userRoleRepository,
		revokedTokenRepository,
	)

	// Setup Controller
	userController := controller.NewUserController(userUseCase, config.Log)

	// Setup Middleware
	authMiddleware := middleware.AuthMiddleware(config.Config, config.DB, revokedTokenRepository, config.Log)

	routeConfig := route.RouteConfig{
		App:            config.App,
		AuthMiddleware: authMiddleware,
		UserController: userController,
	}
	routeConfig.Setup()
}
