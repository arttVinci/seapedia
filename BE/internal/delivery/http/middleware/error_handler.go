package middleware

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/internal/model"
)

// GlobalErrorHandler catches errors from Fiber handlers and returns ApiErrorResponse.
// It handles fiber.Error with specific status codes and falls back to 500 for unexpected errors.
func GlobalErrorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	message := "Internal Server Error"

	// Check if it's a fiber.Error
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
		message = e.Message
	}

	// Log the error
	logrus.WithFields(logrus.Fields{
		"status_code": code,
		"path":        c.Path(),
		"method":      c.Method(),
	}).Error(message)

	// Return ApiErrorResponse
	return c.Status(code).JSON(model.ApiErrorResponse{
		Message:    message,
		StatusCode: code,
	})
}
