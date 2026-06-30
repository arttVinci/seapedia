package controller

import (
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type AdminController struct {
	AdminUseCase *usecase.AdminUseCase
	Log          *logrus.Logger
}

func NewAdminController(adminUseCase *usecase.AdminUseCase, log *logrus.Logger) *AdminController {
	return &AdminController{
		AdminUseCase: adminUseCase,
		Log:          log,
	}
}

func (c *AdminController) SimulateNextDay(ctx *fiber.Ctx) error {
	response, err := c.AdminUseCase.SimulateNextDay(ctx.Context())
	if err != nil {
		c.Log.WithError(err).Error("failed to simulate next day")
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Gagal memajukan hari sistem",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.SimulateNextDayResponse]{
		Data:    response,
		Message: "Sistem berhasil maju 1 hari",
		Success: true,
	})
}

func (c *AdminController) GetDashboardStats(ctx *fiber.Ctx) error {
	stats, err := c.AdminUseCase.GetDashboardStats(ctx.Context())
	if err != nil {
		c.Log.WithError(err).Error("failed to get dashboard stats")
		return ctx.Status(fiber.StatusInternalServerError).JSON(model.ApiErrorResponse{
			StatusCode: fiber.StatusInternalServerError,
			Message:    "Gagal mengambil data dashboard admin",
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(model.WebResponse[*model.DashboardStatsResponse]{
		Data:    stats,
		Message: "Dashboard stats retrieved successfully",
		Success: true,
	})
}
