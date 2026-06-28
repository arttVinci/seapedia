package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type DriverController struct {
	Log     *logrus.Logger
	UseCase *usecase.DriverUseCase
}

func NewDriverController(log *logrus.Logger, useCase *usecase.DriverUseCase) *DriverController {
	return &DriverController{
		Log:     log,
		UseCase: useCase,
	}
}

func (c *DriverController) ListJobs(ctx *fiber.Ctx) error {
	responses, err := c.UseCase.ListJobs(ctx.UserContext())
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[[]model.JobResponse]{
		Data:    responses,
		Message: "Daftar pekerjaan berhasil dimuat",
		Success: true,
	})
}

func (c *DriverController) JobDetail(ctx *fiber.Ctx) error {
	orderID := ctx.Params("id")

	response, err := c.UseCase.JobDetail(ctx.UserContext(), orderID)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.OrderDetailResponse]{
		Data:    response,
		Message: "Detail pekerjaan berhasil dimuat",
		Success: true,
	})
}
