package usecase

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type ProductUseCase struct {
	DB                *gorm.DB
	Log               *logrus.Logger
	Validate          *validator.Validate
	ProductRepository *repository.ProductRepository
}

func NewProductUseCase(db *gorm.DB, log *logrus.Logger, validate *validator.Validate, productRepo *repository.ProductRepository) *ProductUseCase {
	return &ProductUseCase{DB: db, Log: log, Validate: validate, ProductRepository: productRepo}
}

func (u *ProductUseCase) Search(ctx context.Context, request *model.SearchProductRequest) ([]model.ProductResponse, int64, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, 0, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}
	db := u.DB.WithContext(ctx)
	products, total, err := u.ProductRepository.Search(db, request)
	if err != nil {
		u.Log.Warnf("Failed to search products : %+v", err)
		return nil, 0, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan produk")
	}
	return converter.ProductsToResponses(products), total, nil
}

func (u *ProductUseCase) FindById(ctx context.Context, id string) (*model.ProductDetailResponse, error) {
	db := u.DB.WithContext(ctx)
	product := new(entity.Product)
	if err := u.ProductRepository.FindByIdWithStore(db, product, id); err != nil {
		u.Log.Warnf("Failed to find product by id : %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Produk tidak ditemukan")
	}
	return converter.ProductToDetailResponse(product), nil
}
