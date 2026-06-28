package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"

	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type PromoController struct {
	UseCase *usecase.PromoUseCase
	Log     *logrus.Logger
}

func NewPromoController(useCase *usecase.PromoUseCase, log *logrus.Logger) *PromoController {
	return &PromoController{UseCase: useCase, Log: log}
}

func (c *PromoController) Create(ctx *fiber.Ctx) error {
	request := new(model.CreatePromoRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body : %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Create(ctx.UserContext(), request)
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(model.WebResponse[*model.PromoResponse]{Data: response, Message: "Promo berhasil dibuat", Success: true})
}

func (c *PromoController) List(ctx *fiber.Ctx) error {
	responses, err := c.UseCase.FindAll(ctx.UserContext())
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[[]model.PromoResponse]{Data: responses, Message: "Daftar promo", Success: true})
}

func (c *PromoController) Detail(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	response, err := c.UseCase.FindById(ctx.UserContext(), id)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.PromoResponse]{Data: response, Message: "Detail promo", Success: true})
}
