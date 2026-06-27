package controller

import (
	"math"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type ProductController struct {
	UseCase *usecase.ProductUseCase
	Log     *logrus.Logger
}

func NewProductController(useCase *usecase.ProductUseCase, log *logrus.Logger) *ProductController {
	return &ProductController{UseCase: useCase, Log: log}
}

func (c *ProductController) List(ctx *fiber.Ctx) error {
	request := &model.SearchProductRequest{
		Name: ctx.Query("name"),
		Page: ctx.QueryInt("page", 1),
		Size: ctx.QueryInt("size", 10),
	}
	responses, total, err := c.UseCase.Search(ctx.UserContext(), request)
	if err != nil {
		c.Log.Warnf("Failed to search products : %+v", err)
		return err
	}
	paging := &model.PageMetadata{
		Page:      request.Page,
		Size:      request.Size,
		TotalItem: total,
		TotalPage: int64(math.Ceil(float64(total) / float64(request.Size))),
	}
	return ctx.JSON(model.WebResponse[[]model.ProductResponse]{Data: responses, Paging: paging, Message: "Daftar produk", Success: true})
}

func (c *ProductController) Detail(ctx *fiber.Ctx) error {
	id := ctx.Params("id")
	response, err := c.UseCase.FindById(ctx.UserContext(), id)
	if err != nil {
		c.Log.Warnf("Failed to find product : %+v", err)
		return err
	}
	return ctx.JSON(model.WebResponse[*model.ProductDetailResponse]{Data: response, Message: "Detail produk", Success: true})
}
