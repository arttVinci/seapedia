package controller

import (
	"math"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/delivery/http/middleware"
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
	catStr := ctx.Query("category")
	var categories []string
	if catStr != "" {
		categories = strings.Split(catStr, ",")
	}

	request := &model.SearchProductRequest{
		Name:     ctx.Query("name"),
		Page:     ctx.QueryInt("page", 1),
		Size:     ctx.QueryInt("size", 10),
		Category: categories,
		Sort:     ctx.Query("sort"),
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

func (c *ProductController) ListMyProducts(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	catStr := ctx.Query("category")
	var categories []string
	if catStr != "" {
		categories = strings.Split(catStr, ",")
	}

	request := &model.SellerProductSearchRequest{
		Name:     ctx.Query("name"),
		Page:     ctx.QueryInt("page", 1),
		Size:     ctx.QueryInt("size", 10),
		Category: categories,
		Sort:     ctx.Query("sort"),
	}
	responses, total, err := c.UseCase.ListByStore(ctx.UserContext(), userID, request)
	if err != nil {
		return err
	}
	paging := &model.PageMetadata{
		Page:      request.Page,
		Size:      request.Size,
		TotalItem: total,
		TotalPage: int64(math.Ceil(float64(total) / float64(request.Size))),
	}
	return ctx.JSON(model.WebResponse[[]model.ProductResponse]{Data: responses, Paging: paging, Message: "Daftar produk toko", Success: true})
}

func (c *ProductController) CreateProduct(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	request := new(model.CreateProductRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body : %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Create(ctx.UserContext(), userID, request)
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(model.WebResponse[*model.ProductResponse]{Data: response, Message: "Produk berhasil dibuat", Success: true})
}

func (c *ProductController) UpdateProduct(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	productID := ctx.Params("id")
	request := new(model.UpdateProductRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.Warnf("Failed to parse request body : %+v", err)
		return fiber.ErrBadRequest
	}

	response, err := c.UseCase.Update(ctx.UserContext(), userID, productID, request)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[*model.ProductResponse]{Data: response, Message: "Produk berhasil diperbarui", Success: true})
}

func (c *ProductController) DeleteProduct(ctx *fiber.Ctx) error {
	userID := middleware.GetUser(ctx).ID
	productID := ctx.Params("id")

	err := c.UseCase.Delete(ctx.UserContext(), userID, productID)
	if err != nil {
		return err
	}
	return ctx.JSON(model.WebResponse[any]{Data: nil, Message: "Produk berhasil dihapus", Success: true})
}

func (c *ProductController) UploadImage(ctx *fiber.Ctx) error {
	auth := middleware.GetUser(ctx)

	request := new(model.UploadImageRequest)
	if err := ctx.BodyParser(request); err != nil {
		c.Log.WithError(err).Error("error parsing request body")
		return fiber.NewError(fiber.StatusBadRequest, "Format data request tidak valid")
	}

	file, err := ctx.FormFile("image")
	if err != nil {
		c.Log.WithError(err).Error("error parsing request body")
		return fiber.NewError(fiber.StatusBadRequest, "Format data request tidak valid")
	}

	if file.Size > 7*1024*1024 {
		c.Log.Warn("Upload failed: file size exceeds 7MB limit")
		return fiber.NewError(fiber.StatusBadRequest, "Ukuran file melebihi 7MB")
	}

	request.Image = file
	request.UserID = auth.ID

	response, err := c.UseCase.UploadImage(ctx.UserContext(), request)
	if err != nil {
		return err
	}

	return ctx.JSON(model.WebResponse[string]{Data: response})
}
