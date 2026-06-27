package middleware

import (
	"github.com/gofiber/fiber/v2"
)

func RoleMiddleware(allowedRoles ...string) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		auth := GetUser(ctx)
		if auth == nil {
			return fiber.NewError(fiber.StatusUnauthorized, "Token tidak ditemukan")
		}
		for _, role := range allowedRoles {
			if auth.ActiveRole == role {
				return ctx.Next()
			}
		}
		return fiber.NewError(fiber.StatusForbidden, "Anda tidak memiliki akses untuk peran ini")
	}
}
