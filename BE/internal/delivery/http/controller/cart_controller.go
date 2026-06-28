package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type CartController struct {
	Log     *logrus.Logger
	Usecase *usecase.CartUsecase
}

func NewCartController(log *logrus.Logger, usecase *usecase.CartUsecase) *CartController {
	return &CartController{
		Log:     log,
		Usecase: usecase,
	}
}

func (c *CartController) GetCart(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)
	response, err := c.Usecase.GetCart(user.ID)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.CartResponse]{
		Data:    response,
		Message: "Berhasil mengambil keranjang",
		Success: true,
	})
}

func (c *CartController) AddItem(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)
	var request model.AddCartItemRequest
	if err := ctx.BodyParser(&request); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Request tidak valid")
	}

	response, err := c.Usecase.AddItem(user.ID, &request)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.CartResponse]{
		Data:    response,
		Message: "Berhasil menambahkan item ke keranjang",
		Success: true,
	})
}

func (c *CartController) UpdateItem(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)
	itemID := ctx.Params("id")
	var request model.UpdateCartItemRequest
	if err := ctx.BodyParser(&request); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Request tidak valid")
	}

	response, err := c.Usecase.UpdateItem(user.ID, itemID, &request)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.CartResponse]{
		Data:    response,
		Message: "Berhasil memperbarui item keranjang",
		Success: true,
	})
}

func (c *CartController) DeleteItem(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)
	itemID := ctx.Params("id")

	response, err := c.Usecase.DeleteItem(user.ID, itemID)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.CartResponse]{
		Data:    response,
		Message: "Berhasil menghapus item keranjang",
		Success: true,
	})
}
