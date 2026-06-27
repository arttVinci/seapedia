package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
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

func (c *StoreController) Detail(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	response, err := c.UseCase.FindById(ctx.UserContext(), id)
	if err != nil {
		c.Log.Warnf("Failed to find store : %+v", err)
		return err
	}
	return ctx.JSON(model.WebResponse[*model.StoreResponse]{Data: response, Message: "Detail toko", Success: true})
}
