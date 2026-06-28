package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type SellerReportController struct {
	Log     *logrus.Logger
	UseCase *usecase.SellerReportUseCase
}

func NewSellerReportController(log *logrus.Logger, useCase *usecase.SellerReportUseCase) *SellerReportController {
	return &SellerReportController{
		Log:     log,
		UseCase: useCase,
	}
}

func (c *SellerReportController) GetIncome(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)

	response, err := c.UseCase.GetIncome(ctx.UserContext(), user.ID)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.SellerIncomeResponse]{
		Data:    response,
		Message: "Laporan pendapatan",
		Success: true,
	})
}