package controller

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/usecase"
)

type CategoryController struct {
	Log             *logrus.Logger
	CategoryUseCase *usecase.CategoryUseCase
}

func NewCategoryController(log *logrus.Logger, categoryUseCase *usecase.CategoryUseCase) *CategoryController {
	return &CategoryController{Log: log, CategoryUseCase: categoryUseCase}
}

// @Summary      Get All Categories
// @Description  Get a list of all product categories
// @Tags         Categories
// @Produce      json
// @Router       /api/categories [get]
func (c *CategoryController) GetAll(ctx *fiber.Ctx) error {
	categories, err := c.CategoryUseCase.GetAll(ctx.Context())
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[[]string]{
		Data: categories,
	})
}
