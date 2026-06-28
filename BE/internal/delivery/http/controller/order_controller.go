package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type OrderController struct {
	Log     *logrus.Logger
	UseCase *usecase.OrderUseCase
}

func NewOrderController(log *logrus.Logger, useCase *usecase.OrderUseCase) *OrderController {
	return &OrderController{
		Log:     log,
		UseCase: useCase,
	}
}

func (c *OrderController) ListBuyerOrders(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)

	responses, err := c.UseCase.ListBuyerOrders(ctx.UserContext(), user.ID)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[[]model.OrderResponse]{
		Data:    responses,
		Message: "Riwayat pesanan",
		Success: true,
	})
}

func (c *OrderController) GetBuyerOrderDetail(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)
	orderID := ctx.Params("id")

	response, err := c.UseCase.GetBuyerOrderDetail(ctx.UserContext(), user.ID, orderID)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.OrderDetailResponse]{
		Data:    response,
		Message: "Detail pesanan",
		Success: true,
	})
}