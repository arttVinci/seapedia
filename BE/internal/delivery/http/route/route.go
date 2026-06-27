package route

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/traa/seapedia/server/internal/delivery/http/controller"
)

type RouteConfig struct {
	App               *fiber.App
	AuthMiddleware    fiber.Handler
	UserController    *controller.UserController
	ProductController *controller.ProductController
	StoreController   *controller.StoreController
	RoleMiddleware    func(allowedRoles ...string) fiber.Handler
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
	c.App.Group("/api/seller", c.AuthMiddleware, c.RoleMiddleware("seller"))
}
func (c *RouteConfig) SetupBuyerRoute() {
	c.App.Group("/api/buyer", c.AuthMiddleware, c.RoleMiddleware("buyer"))
}
func (c *RouteConfig) SetupDriverRoute() {
	c.App.Group("/api/driver", c.AuthMiddleware, c.RoleMiddleware("driver"))
}
func (c *RouteConfig) SetupAdminRoute() {
	c.App.Group("/api/admin", c.AuthMiddleware, c.RoleMiddleware("admin"))
}
