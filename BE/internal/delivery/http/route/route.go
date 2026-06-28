package route

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/traa/seapedia/server/internal/delivery/http/controller"
)

type RouteConfig struct {
	App                         *fiber.App
	AuthMiddleware              fiber.Handler
	UserController              *controller.UserController
	ProductController           *controller.ProductController
	StoreController             *controller.StoreController
	ApplicationReviewController *controller.ApplicationReviewController
	WalletController            *controller.WalletController
	AddressController           *controller.AddressController
	CartController              *controller.CartController
	CheckoutController          *controller.CheckoutController
	OrderController             *controller.OrderController
	VoucherController           *controller.VoucherController
	PromoController             *controller.PromoController
	SellerOrderController       *controller.SellerOrderController
	BuyerReportController       *controller.BuyerReportController
	SellerReportController      *controller.SellerReportController
	DriverController            *controller.DriverController
	RoleMiddleware              func(allowedRoles ...string) fiber.Handler
}

func (c *RouteConfig) Setup() {
	c.App.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, PATCH",
	}))

	c.SetupGuestRoute()
	c.SetupPublicRoute()
	c.SetupAuthRoute()
	c.SetupSellerRoute()
	c.SetupBuyerRoute()
	c.SetupDriverRoute()
	c.SetupAdminRoute()
}

func (c *RouteConfig) SetupGuestRoute() {
	// Register & Login dapat diakses tamu tanpa token
	c.App.Post("/api/users", c.UserController.Register)
	c.App.Post("/api/users/_login", c.UserController.Login)
}

func (c *RouteConfig) SetupPublicRoute() {
	c.App.Get("/api/products", c.ProductController.List)
	c.App.Get("/api/products/:id", c.ProductController.Detail)
	c.App.Get("/api/stores/:id", c.StoreController.Detail)

	// Reviews
	c.App.Get("/api/reviews", c.ApplicationReviewController.List)
	c.App.Post("/api/reviews", c.ApplicationReviewController.Create)
}

func (c *RouteConfig) SetupAuthRoute() {
	authGroup := c.App.Group("/api/users", c.AuthMiddleware)

	// Logout membutuhkan token valid; jti token akan dicabut (denylist)
	authGroup.Post("/_logout", c.UserController.Logout)

	// Role routes
	authGroup.Get("/_roles", c.UserController.Roles)
	authGroup.Post("/_select-role", c.UserController.SelectRole)
	authGroup.Get("/_current", c.UserController.Current)
}

func (c *RouteConfig) SetupSellerRoute() {
	sellerGroup := c.App.Group("/api/seller", c.AuthMiddleware, c.RoleMiddleware("seller"))
	sellerGroup.Get("/store", c.StoreController.GetMyStore)
	sellerGroup.Post("/store", c.StoreController.CreateStore)
	sellerGroup.Put("/store", c.StoreController.UpdateStore)

	sellerGroup.Get("/products", c.ProductController.ListMyProducts)
	sellerGroup.Post("/products", c.ProductController.CreateProduct)
	sellerGroup.Put("/products/:id", c.ProductController.UpdateProduct)
	sellerGroup.Delete("/products/:id", c.ProductController.DeleteProduct)

	// Orders
	if c.SellerOrderController != nil {
		sellerGroup.Get("/orders", c.SellerOrderController.ListSellerOrders)
		sellerGroup.Get("/orders/:id", c.SellerOrderController.GetSellerOrderDetail)
		sellerGroup.Post("/orders/:id/_process", c.SellerOrderController.ProcessOrder)
	}

	// Reports
	if c.SellerReportController != nil {
		sellerGroup.Get("/reports/_income", c.SellerReportController.GetIncome)
	}
}
func (c *RouteConfig) SetupBuyerRoute() {
	buyerGroup := c.App.Group("/api/buyer", c.AuthMiddleware, c.RoleMiddleware("buyer"))

	// Wallet
	buyerGroup.Get("/wallet", c.WalletController.GetWallet)
	buyerGroup.Post("/wallet/_topup", c.WalletController.Topup)

	// Addresses
	buyerGroup.Get("/addresses", c.AddressController.List)
	buyerGroup.Post("/addresses", c.AddressController.Create)
	buyerGroup.Put("/addresses/:id", c.AddressController.Update)
	buyerGroup.Delete("/addresses/:id", c.AddressController.Delete)

	// Cart
	buyerGroup.Get("/cart", c.CartController.GetCart)
	buyerGroup.Post("/cart/_items", c.CartController.AddItem)
	buyerGroup.Put("/cart/_items/:id", c.CartController.UpdateItem)
	buyerGroup.Delete("/cart/_items/:id", c.CartController.DeleteItem)

	// Checkout
	buyerGroup.Post("/checkout/_preview", c.CheckoutController.Preview)
	buyerGroup.Post("/checkout", c.CheckoutController.Checkout)

	// Orders
	buyerGroup.Get("/orders", c.OrderController.ListBuyerOrders)
	buyerGroup.Get("/orders/:id", c.OrderController.GetBuyerOrderDetail)

	// Reports
	if c.BuyerReportController != nil {
		buyerGroup.Get("/reports/_expense", c.BuyerReportController.GetExpense)
	}
}
func (c *RouteConfig) SetupDriverRoute() {
	driverGroup := c.App.Group("/api/driver", c.AuthMiddleware, c.RoleMiddleware("driver"))

	// Jobs
	if c.DriverController != nil {
		driverGroup.Get("/jobs", c.DriverController.ListJobs)
		driverGroup.Get("/jobs/:id", c.DriverController.JobDetail)
		driverGroup.Post("/jobs/:id/_take", c.DriverController.TakeJob)
		driverGroup.Post("/jobs/:id/_complete", c.DriverController.CompleteJob)
		driverGroup.Get("/dashboard", c.DriverController.Dashboard)
	}
}
func (c *RouteConfig) SetupAdminRoute() {
	adminGroup := c.App.Group("/api/admin", c.AuthMiddleware, c.RoleMiddleware("admin"))

	// Vouchers
	adminGroup.Get("/vouchers", c.VoucherController.List)
	adminGroup.Post("/vouchers", c.VoucherController.Create)
	adminGroup.Get("/vouchers/:id", c.VoucherController.Detail)

	// Promos
	adminGroup.Get("/promos", c.PromoController.List)
	adminGroup.Post("/promos", c.PromoController.Create)
	adminGroup.Get("/promos/:id", c.PromoController.Detail)
}
