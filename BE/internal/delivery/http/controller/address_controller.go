package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type AddressController struct {
	UseCase *usecase.AddressUseCase
	Log     *logrus.Logger
}

func NewAddressController(useCase *usecase.AddressUseCase, log *logrus.Logger) *AddressController {
	return &AddressController{UseCase: useCase, Log: log}
}

func (c *AddressController) List(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	response, err := c.UseCase.List(ctx.UserContext(), userID)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[[]model.AddressResponse]{
		Data:    response,
		Message: "Daftar alamat berhasil diambil",
		Success: true,
	})
}

func (c *AddressController) Create(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	request := new(model.CreateAddressRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body: %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Create(ctx.UserContext(), userID, request)
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(model.WebResponse[*model.AddressResponse]{
		Data:    response,
		Message: "Alamat berhasil dibuat",
		Success: true,
	})
}

func (c *AddressController) Update(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	addressID := ctx.Params("id")
	request := new(model.UpdateAddressRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body: %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Update(ctx.UserContext(), userID, addressID, request)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.AddressResponse]{
		Data:    response,
		Message: "Alamat berhasil diperbarui",
		Success: true,
	})
}

func (c *AddressController) Delete(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	addressID := ctx.Params("id")

	err := c.UseCase.Delete(ctx.UserContext(), userID, addressID)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[any]{
		Data:    nil,
		Message: "Alamat berhasil dihapus",
		Success: true,
	})
}
