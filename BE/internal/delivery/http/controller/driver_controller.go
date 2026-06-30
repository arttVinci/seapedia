package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
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

// @Summary      List Driver Jobs
// @Description  Get a list of available delivery jobs for the driver
// @Tags         Driver Jobs
// @Produce      json
// @Security     BearerAuth
// @Router       /api/driver/jobs [get]
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
	userID := middleware.GetUser(ctx).ID

	response, err := c.UseCase.JobDetail(ctx.UserContext(), orderID, userID)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.OrderDetailResponse]{
		Data:    response,
		Message: "Detail pekerjaan berhasil dimuat",
		Success: true,
	})
}

// @Summary      Take a Delivery Job
// @Description  Accept a delivery job
// @Tags         Driver Jobs
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Job ID (Order ID)"
// @Router       /api/driver/jobs/{id}/take [post]
func (c *DriverController) TakeJob(ctx *fiber.Ctx) error {
	orderID := ctx.Params("id")
	userID := middleware.GetUser(ctx).ID

	err := c.UseCase.TakeJob(ctx.UserContext(), userID, orderID)
	if err != nil {
		return err
	}

	return ctx.JSON(model.WebResponse[model.TakeJobResponse]{
		Data: model.TakeJobResponse{
			Success: true,
		},
		Message: "Pekerjaan berhasil diambil",
		Success: true,
	})
}

// @Summary      Complete a Delivery Job
// @Description  Mark a delivery job as completed
// @Tags         Driver Jobs
// @Produce      json
// @Security     BearerAuth
// @Param        id   path      string  true  "Job ID (Order ID)"
// @Router       /api/driver/jobs/{id}/complete [post]
func (c *DriverController) CompleteJob(ctx *fiber.Ctx) error {
	orderID := ctx.Params("id")
	userID := middleware.GetUser(ctx).ID

	response, err := c.UseCase.CompleteJob(ctx.UserContext(), userID, orderID)
	if err != nil {
		return err
	}

	return ctx.JSON(model.WebResponse[*model.CompleteJobResponse]{
		Data:    response,
		Message: "Pekerjaan berhasil diselesaikan",
		Success: true,
	})
}

func (c *DriverController) Dashboard(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID

	response, err := c.UseCase.Dashboard(ctx.UserContext(), userID)
	if err != nil {
		return err
	}

	return ctx.JSON(model.WebResponse[*model.DashboardResponse]{
		Data:    response,
		Message: "Dashboard driver",
		Success: true,
	})
}
