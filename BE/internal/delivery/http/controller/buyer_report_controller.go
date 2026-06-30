package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type BuyerReportController struct {
	Log     *logrus.Logger
	UseCase *usecase.BuyerReportUseCase
}

func NewBuyerReportController(log *logrus.Logger, useCase *usecase.BuyerReportUseCase) *BuyerReportController {
	return &BuyerReportController{
		Log:     log,
		UseCase: useCase,
	}
}

// @Summary      Get Buyer Expense
// @Description  Get expense history for the current buyer
// @Tags         Buyer Reports
// @Produce      json
// @Security     BearerAuth
// @Router       /api/buyer/reports/expense [get]
func (c *BuyerReportController) GetExpense(ctx *fiber.Ctx) error {
	user := middleware.GetUser(ctx)

	response, err := c.UseCase.GetExpense(ctx.UserContext(), user.ID)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.BuyerExpenseResponse]{
		Data:    response,
		Message: "Laporan pengeluaran",
		Success: true,
	})
}