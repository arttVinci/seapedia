package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"

	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type StoreController struct {
	UseCase *usecase.StoreUseCase
	Log     *logrus.Logger
}

func NewStoreController(useCase *usecase.StoreUseCase, log *logrus.Logger) *StoreController {
	return &StoreController{UseCase: useCase, Log: log}
}

// @Summary      List Stores
// @Description  Get a list of all stores
// @Tags         Stores
// @Produce      json
// @Router       /api/stores [get]
func (c *StoreController) List(ctx *fiber.Ctx) error {
	response, err := c.UseCase.FindAll(ctx.UserContext())
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[[]model.StoreResponse]{Data: response, Message: "Daftar toko", Success: true})
}

// @Summary      Get Store Detail
// @Description  Get details of a specific store
// @Tags         Stores
// @Produce      json
// @Param        id   path      string  true  "Store ID"
// @Router       /api/stores/{id} [get]
func (c *StoreController) Detail(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	response, err := c.UseCase.FindById(ctx.UserContext(), id)
	if err != nil {
		c.Log.Warnf("Failed to find store : %+v", err)
		return err
	}
	return ctx.JSON(model.WebResponse[*model.StoreResponse]{Data: response, Message: "Detail toko", Success: true})
}

// @Summary      Get My Store
// @Description  Get details of the current seller's store
// @Tags         Seller Store
// @Produce      json
// @Security     BearerAuth
// @Router       /api/seller/store [get]
func (c *StoreController) GetMyStore(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	response, err := c.UseCase.FindByUserID(ctx.UserContext(), userID)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.StoreResponse]{Data: response, Message: "Toko saya", Success: true})
}

// @Summary      Create Store
// @Description  Create a store for the current seller
// @Tags         Seller Store
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Router       /api/seller/store [post]
func (c *StoreController) CreateStore(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	request := new(model.CreateStoreRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body : %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Create(ctx.UserContext(), userID, request)
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(model.WebResponse[*model.StoreResponse]{Data: response, Message: "Toko berhasil dibuat", Success: true})
}

// @Summary      Update Store
// @Description  Update details of the current seller's store
// @Tags         Seller Store
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Router       /api/seller/store [put]
func (c *StoreController) UpdateStore(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	request := new(model.UpdateStoreRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body : %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Update(ctx.UserContext(), userID, request)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.StoreResponse]{Data: response, Message: "Toko berhasil diperbarui", Success: true})
}
