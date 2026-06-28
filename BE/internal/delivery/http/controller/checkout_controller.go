package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type CheckoutController struct {
	Log     *logrus.Logger
	UseCase *usecase.CheckoutUseCase
}

func NewCheckoutController(log *logrus.Logger, useCase *usecase.CheckoutUseCase) *CheckoutController {
	return &CheckoutController{
		Log:     log,
		UseCase: useCase,
	}
}

func (c *CheckoutController) Preview(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)

	var request model.CheckoutPreviewRequest
	if err := ctx.BodyParser(&request); err != nil {
		c.Log.Warnf("Failed to parse request body: %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Preview(ctx.UserContext(), user.ID, &request)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.CheckoutPreviewResponse]{
		Data:    response,
		Message: "Ringkasan checkout",
		Success: true,
	})
}