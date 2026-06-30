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

// @Summary      Create a Promo
// @Description  Create a new promo for the store
// @Tags         Seller Promos
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Router       /api/seller/promos [post]
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

// @Summary      List Store Promos
// @Description  Get a list of promos for the current seller's store
// @Tags         Seller Promos
// @Produce      json
// @Security     BearerAuth
// @Router       /api/seller/promos [get]
func (c *PromoController) List(ctx *fiber.Ctx) error {
	responses, err := c.UseCase.FindAll(ctx.UserContext())
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[[]model.PromoResponse]{Data: responses, Message: "Daftar promo", Success: true})
}

// @Summary      Get Promo Detail
// @Description  Get details of a specific promo
// @Tags         Seller Promos
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Promo ID"
// @Router       /api/seller/promos/{id} [get]
func (c *PromoController) Detail(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	response, err := c.UseCase.FindById(ctx.UserContext(), id)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.PromoResponse]{Data: response, Message: "Detail promo", Success: true})
}
