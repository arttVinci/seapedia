package route

import (
	"github.com/gofiber/fiber/v2"
	"github.com/traa/seapedia/internal/config"
	"gorm.io/gorm"
)

// InitRoutes registers all application routes.
// This is a placeholder that will be populated as modules are implemented.
func InitRoutes(app *fiber.App, db *gorm.DB, cfg *config.Config) {
	// API group
	api := app.Group("/api")

	// Health check
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	_ = db  // db will be used by route groups
	_ = cfg // cfg will be used by route groups

	// Route groups to be added in subsequent tasks:
	// - Guest routes (public)
	// - Auth routes (token required)
	// - Admin routes (admin only)
	// - Seller routes (seller role)
	// - Buyer routes (buyer role)
	// - Driver routes (driver role)
}
