package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type SellerOrderController struct {
	Log     *logrus.Logger
	UseCase *usecase.SellerOrderUseCase
}

func NewSellerOrderController(log *logrus.Logger, useCase *usecase.SellerOrderUseCase) *SellerOrderController {
	return &SellerOrderController{
		Log:     log,
		UseCase: useCase,
	}
}

func (c *SellerOrderController) ListSellerOrders(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)

	responses, err := c.UseCase.ListSellerOrders(ctx.UserContext(), user.ID)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[[]model.OrderResponse]{
		Data:    responses,
		Message: "Daftar pesanan masuk",
		Success: true,
	})
}
