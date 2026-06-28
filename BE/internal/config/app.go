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
	walletRepository := repository.NewWalletRepository(config.Log)
	walletTransactionRepository := repository.NewWalletTransactionRepository(config.Log)
	addressRepository := repository.NewAddressRepository(config.Log)
	orderRepository := repository.NewOrderRepository(config.Log)
	orderItemRepository := repository.NewOrderItemRepository(config.Log)
	orderStatusHistoryRepository := repository.NewOrderStatusHistoryRepository(config.Log)
	deliveryRepository := repository.NewDeliveryRepository(config.Log)
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
	walletUseCase := usecase.NewWalletUseCase(config.DB, config.Log, config.Validate, walletRepository, walletTransactionRepository)
	addressUseCase := usecase.NewAddressUseCase(config.DB, config.Log, config.Validate, addressRepository)
	checkoutUseCase := usecase.NewCheckoutUseCase(
		config.DB, config.Log, config.Validate,
		cartRepository, productRepository, walletRepository, walletTransactionRepository,
		orderRepository, orderItemRepository, orderStatusHistoryRepository, deliveryRepository,
		voucherRepository, promoRepository,
	)
	orderUseCase := usecase.NewOrderUseCase(config.DB, config.Log, orderRepository)
	voucherUseCase := usecase.NewVoucherUseCase(config.DB, config.Log, config.Validate, voucherRepository)
	promoUseCase := usecase.NewPromoUseCase(config.DB, config.Log, config.Validate, promoRepository)
	sellerOrderUseCase := usecase.NewSellerOrderUseCase(config.DB, config.Log, orderRepository, storeRepository, orderStatusHistoryRepository)
	buyerReportUseCase := usecase.NewBuyerReportUseCase(config.DB, config.Log, orderRepository)
	sellerReportUseCase := usecase.NewSellerReportUseCase(config.DB, config.Log, orderRepository, storeRepository)
	driverUseCase := usecase.NewDriverUseCase(config.DB, config.Log, orderRepository, deliveryRepository, orderStatusHistoryRepository, walletRepository, walletTransactionRepository, storeRepository)

	// Setup Controller
	userController := controller.NewUserController(userUseCase, config.Log)
	productController := controller.NewProductController(productUseCase, config.Log)
	storeController := controller.NewStoreController(storeUseCase, config.Log)
	applicationReviewController := controller.NewApplicationReviewController(applicationReviewUseCase, config.Log)
	cartController := controller.NewCartController(config.Log, cartUseCase)
	walletController := controller.NewWalletController(walletUseCase, config.Log)
	addressController := controller.NewAddressController(addressUseCase, config.Log)
	checkoutController := controller.NewCheckoutController(config.Log, checkoutUseCase)
	orderController := controller.NewOrderController(config.Log, orderUseCase)
	voucherController := controller.NewVoucherController(voucherUseCase, config.Log)
	promoController := controller.NewPromoController(promoUseCase, config.Log)
	sellerOrderController := controller.NewSellerOrderController(config.Log, sellerOrderUseCase)
	buyerReportController := controller.NewBuyerReportController(config.Log, buyerReportUseCase)
	sellerReportController := controller.NewSellerReportController(config.Log, sellerReportUseCase)
	driverController := controller.NewDriverController(config.Log, driverUseCase)

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
		WalletController:            walletController,
		AddressController:           addressController,
		CheckoutController:          checkoutController,
		OrderController:             orderController,
		VoucherController:           voucherController,
		PromoController:             promoController,
		SellerOrderController:       sellerOrderController,
		BuyerReportController:       buyerReportController,
		SellerReportController:      sellerReportController,
		DriverController:            driverController,
		RoleMiddleware:              roleMiddleware,
	}
	routeConfig.Setup()
}
