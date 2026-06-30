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

// @Summary      Simulate time +1 Day (Admin Only)
// @Description  Advances system virtual time by 1 day and checks overdue SLAs for active orders.
// @Tags         Admin
// @Produce      json
// @Success      200  {object}  model.WebResponse[model.SimulateNextDayResponse]
// @Failure      500  {object}  model.ApiErrorResponse
// @Security     BearerAuth
// @Router       /api/admin/_simulate-time [post]
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

// @Summary      Get Dashboard Stats (Admin Only)
// @Description  Get statistics for admin dashboard
// @Tags         Admin
// @Produce      json
// @Success      200  {object}  model.WebResponse[model.DashboardStatsResponse]
// @Failure      500  {object}  model.ApiErrorResponse
// @Security     BearerAuth
// @Router       /api/admin/dashboard/stats [get]
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
