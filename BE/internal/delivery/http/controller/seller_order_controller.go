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

func (c *SellerOrderController) ProcessOrder(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)
	orderID := ctx.Params("id")

	err := c.UseCase.ProcessOrder(ctx.UserContext(), user.ID, orderID)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[interface{}]{
		Message: "Pesanan berhasil diproses",
		Success: true,
	})
}

func NewSellerOrderController(log *logrus.Logger, useCase *usecase.SellerOrderUseCase) *SellerOrderController {
	return &SellerOrderController{
		Log:     log,
		UseCase: useCase,
	}
}

func (c *SellerOrderController) GetSellerOrderDetail(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)
	orderID := ctx.Params("id")

	order, err := c.UseCase.GetSellerOrderDetail(ctx.UserContext(), user.ID, orderID)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.OrderDetailResponse]{
		Data:    order,
		Message: "Detail pesanan",
		Success: true,
	})
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
