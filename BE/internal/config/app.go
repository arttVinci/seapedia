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
	productRepository := repository.NewProductRepository(config.Log)
	storeRepository := repository.NewStoreRepository(config.Log)
	applicationReviewRepository := repository.NewApplicationReviewRepository(config.Log)
	cartRepository := repository.NewCartRepository(config.Log)
	cartItemRepository := repository.NewCartItemRepository(config.Log)
	voucherRepository := repository.NewVoucherRepository(config.Log)
	promoRepository := repository.NewPromoRepository(config.Log)

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
	productUseCase := usecase.NewProductUseCase(config.DB, config.Log, config.Validate, productRepository, storeRepository)
	storeUseCase := usecase.NewStoreUseCase(config.DB, config.Log, config.Validate, storeRepository)
	applicationReviewUseCase := usecase.NewApplicationReviewUseCase(config.DB, config.Log, config.Validate, applicationReviewRepository)
	cartUseCase := usecase.NewCartUsecase(config.DB, config.Log, config.Validate, cartRepository, cartItemRepository, productRepository)
	voucherUseCase := usecase.NewVoucherUseCase(config.DB, config.Log, config.Validate, voucherRepository)
	promoUseCase := usecase.NewPromoUseCase(config.DB, config.Log, config.Validate, promoRepository)

	// Setup Controller
	userController := controller.NewUserController(userUseCase, config.Log)
	productController := controller.NewProductController(productUseCase, config.Log)
	storeController := controller.NewStoreController(storeUseCase, config.Log)
	applicationReviewController := controller.NewApplicationReviewController(applicationReviewUseCase, config.Log)
	cartController := controller.NewCartController(config.Log, cartUseCase)
	voucherController := controller.NewVoucherController(voucherUseCase, config.Log)
	promoController := controller.NewPromoController(promoUseCase, config.Log)

	// Setup Middleware
	authMiddleware := middleware.AuthMiddleware(config.Config, config.DB, revokedTokenRepository, config.Log)
	roleMiddleware := middleware.RoleMiddleware

	routeConfig := route.RouteConfig{
		App:                         config.App,
		AuthMiddleware:              authMiddleware,
		UserController:              userController,
		ProductController:           productController,
		StoreController:             storeController,
		ApplicationReviewController: applicationReviewController,
		CartController:              cartController,
		VoucherController:           voucherController,
		PromoController:             promoController,
		RoleMiddleware:              roleMiddleware,
	}
	routeConfig.Setup()
}
