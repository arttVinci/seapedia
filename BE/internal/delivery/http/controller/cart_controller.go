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

// @Summary      Get Buyer Cart
// @Description  Get the current user's shopping cart
// @Tags         Buyer Cart
// @Produce      json
// @Security     BearerAuth
// @Router       /api/cart [get]
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

// @Summary      Add Item to Cart
// @Description  Add a product to the cart
// @Tags         Buyer Cart
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Router       /api/cart/items [post]
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

// @Summary      Update Cart Item
// @Description  Update the quantity of a cart item
// @Tags         Buyer Cart
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Item ID"
// @Router       /api/cart/items/{id} [put]
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

// @Summary      Delete Cart Item
// @Description  Remove an item from the cart
// @Tags         Buyer Cart
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Item ID"
// @Router       /api/cart/items/{id} [delete]
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
