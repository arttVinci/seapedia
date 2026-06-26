package route

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

type RouteConfig struct {
	App                     *fiber.App
	AuthMiddleware          fiber.Handler
	// UserController          *controller.UserController
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
	// c.App.Post("/api/users", c.UserController.Register)
	// c.App.Post("/api/users/_otp", c.UserController.RequestOTP)
	// c.App.Post("/api/users/_login", c.UserController.Login)

}

func (c *RouteConfig) SetupPublicRoute() {
	
}

func (c *RouteConfig) SetupAuthRoute() {
	c.App.Use(c.AuthMiddleware)

	// c.App.Delete("/api/users", c.UserController.Logout)
	// c.App.Patch("/api/users/_current", c.UserController.Update)
	// c.App.Get("/api/users/_current", c.UserController.Current)

	
}
