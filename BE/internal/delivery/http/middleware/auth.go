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
			return fiber.NewError(fiber.StatusUnauthorized, "Token tidak ditemukan")
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Warn("Invalid Authorization header format")
			return fiber.NewError(fiber.StatusUnauthorized, "Token tidak valid")
		}

		tokenString := parts[1]
		secret := config.GetString("jwt.secret")

		claims, err := auth.ParseToken(secret, tokenString)
		if err != nil {
			log.Warnf("Failed to parse token: %+v", err)
			return fiber.NewError(fiber.StatusUnauthorized, "Token tidak valid")
		}

		exists, err := revokedTokenRepo.ExistsByJTI(db, claims.ID)
		if err != nil {
			log.Warnf("Failed to check revoked token: %+v", err)
			return fiber.NewError(fiber.StatusInternalServerError, "Internal Server Error")
		}

		if exists {
			log.Warn("Token has been revoked")
			return fiber.NewError(fiber.StatusUnauthorized, "Token telah dicabut")
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
