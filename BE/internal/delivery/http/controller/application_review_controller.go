package controller

import (
	"math"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type ApplicationReviewController struct {
	UseCase *usecase.ApplicationReviewUseCase
	Log     *logrus.Logger
}

func NewApplicationReviewController(useCase *usecase.ApplicationReviewUseCase, log *logrus.Logger) *ApplicationReviewController {
	return &ApplicationReviewController{UseCase: useCase, Log: log}
}

// @Summary      List App Reviews
// @Description  Get all application reviews
// @Tags         App Reviews
// @Produce      json
// @Router       /api/reviews/app [get]
func (c *ApplicationReviewController) List(ctx *fiber.Ctx) error {
	request := &model.SearchApplicationReviewRequest{
		Page: ctx.QueryInt("page", 1),
		Size: ctx.QueryInt("size", 10),
	}
	responses, total, err := c.UseCase.Search(ctx.UserContext(), request)
	if err != nil {
		c.Log.Warnf("Failed to search reviews : %+v", err)
		return err
	}
	paging := &model.PageMetadata{
		Page:      request.Page,
		Size:      request.Size,
		TotalItem: total,
		TotalPage: int64(math.Ceil(float64(total) / float64(request.Size))),
	}
	return ctx.JSON(model.WebResponse[[]model.ApplicationReviewResponse]{Data: responses, Paging: paging, Message: "Daftar ulasan", Success: true})
}

// @Summary      Create App Review
// @Description  Submit a review for the application
// @Tags         App Reviews
// @Accept       json
// @Produce      json
// @Security     BearerAuth
// @Router       /api/reviews/app [post]
func (c *ApplicationReviewController) Create(ctx *fiber.Ctx) error {
	request := new(model.CreateApplicationReviewRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body : %+v", err)
		return fiber.NewError(fiber.StatusBadRequest, "Format data request tidak valid")
	}
	response, err := c.UseCase.Create(ctx.UserContext(), request)
	if err != nil {
		c.Log.Warnf("Failed to create review : %+v", err)
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(model.WebResponse[*model.ApplicationReviewResponse]{Data: response, Message: "Ulasan berhasil dikirim", Success: true})
}
