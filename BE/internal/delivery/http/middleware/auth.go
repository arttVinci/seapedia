package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"github.com/traa/seapedia/server/internal/auth"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

func AuthMiddleware(config *viper.Viper, db *gorm.DB, revokedTokenRepo *repository.RevokedTokenRepository, log *logrus.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			log.Warn("Authorization header not found")
			return c.Status(fiber.StatusUnauthorized).JSON(model.ApiErrorResponse{
				Message:    "Token tidak ditemukan",
				StatusCode: fiber.StatusUnauthorized,
			})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Warn("Invalid Authorization header format")
			return c.Status(fiber.StatusUnauthorized).JSON(model.ApiErrorResponse{
				Message:    "Token tidak valid",
				StatusCode: fiber.StatusUnauthorized,
			})
		}

		tokenString := parts[1]
		secret := config.GetString("jwt.secret")

		claims, err := auth.ParseToken(secret, tokenString)
		if err != nil {
			log.Warnf("Failed to parse token: %+v", err)
			return c.Status(fiber.StatusUnauthorized).JSON(model.ApiErrorResponse{
				Message:    "Token tidak valid",
				StatusCode: fiber.StatusUnauthorized,
			})
		}

		exists, err := revokedTokenRepo.ExistsByJTI(db, claims.ID)
		if err != nil {
			log.Warnf("Failed to check revoked token: %+v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
				Message:    "Internal Server Error",
				StatusCode: fiber.StatusInternalServerError,
			})
		}

		if exists {
			log.Warn("Token has been revoked")
			return c.Status(fiber.StatusUnauthorized).JSON(model.ApiErrorResponse{
				Message:    "Token telah dicabut",
				StatusCode: fiber.StatusUnauthorized,
			})
		}

		authModel := &model.Auth{
			ID:         claims.ID,
			Username:   claims.Username,
			ActiveRole: claims.ActiveRole,
			JTI:        claims.RegisteredClaims.ID,
			Exp:        claims.ExpiresAt.Unix(),
		}

		c.Locals("auth", authModel)
		return c.Next()
	}
}

func GetUser(c *fiber.Ctx) *model.Auth {
	return c.Locals("auth").(*model.Auth)
}
