package config

import (
	"github.com/gofiber/fiber/v2"
	"github.com/traa/seapedia/internal/delivery/http/middleware"
)

// NewFiberApp creates a new Fiber application instance with the global error handler.
func NewFiberApp() *fiber.App {
	app := fiber.New(fiber.Config{
		ErrorHandler: middleware.GlobalErrorHandler,
	})

	return app
}
