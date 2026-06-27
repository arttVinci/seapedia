package route

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"

	"github.com/traa/seapedia/server/internal/delivery/http/controller"
)

type RouteConfig struct {
	App            *fiber.App
	AuthMiddleware fiber.Handler
	UserController *controller.UserController
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
}

func (c *RouteConfig) SetupGuestRoute() {
	// Register & Login dapat diakses tamu tanpa token
	c.App.Post("/api/users", c.UserController.Register)
	c.App.Post("/api/users/_login", c.UserController.Login)
}

func (c *RouteConfig) SetupPublicRoute() {

}

func (c *RouteConfig) SetupAuthRoute() {
	// Semua route di bawah ini wajib token valid (AuthMiddleware)
	c.App.Use(c.AuthMiddleware)

	// Logout membutuhkan token valid; jti token akan dicabut (denylist)
	c.App.Post("/api/users/_logout", c.UserController.Logout)

	// Role routes
	c.App.Get("/api/users/_roles", c.UserController.Roles)
	c.App.Post("/api/users/_select-role", c.UserController.SelectRole)
	c.App.Get("/api/users/_current", c.UserController.Current)
}
