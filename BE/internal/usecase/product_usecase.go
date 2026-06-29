package usecase

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type ProductUseCase struct {
	DB                    *gorm.DB
	Log                   *logrus.Logger
	Validate              *validator.Validate
	ProductRepository     *repository.ProductRepository
	StoreRepository       *repository.StoreRepository
	UploadImageRepository *repository.UploadImageRepository
}

func NewProductUseCase(db *gorm.DB, log *logrus.Logger, validate *validator.Validate, productRepo *repository.ProductRepository, storeRepo *repository.StoreRepository, uploadRepo *repository.UploadImageRepository) *ProductUseCase {
	return &ProductUseCase{DB: db, Log: log, Validate: validate, ProductRepository: productRepo, StoreRepository: storeRepo, UploadImageRepository: uploadRepo}
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

func (u *ProductUseCase) getStoreID(ctx context.Context, userID string) (string, error) {
	db := u.DB.WithContext(ctx)
	store := new(entity.Store)
	if err := u.StoreRepository.FindByUserID(db, store, userID); err != nil {
		return "", fiber.NewError(fiber.StatusNotFound, "Anda belum memiliki toko")
	}
	return store.ID, nil
}

func (u *ProductUseCase) ListByStore(ctx context.Context, userID string, request *model.SellerProductSearchRequest) ([]model.ProductResponse, int64, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, 0, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	storeID, err := u.getStoreID(ctx, userID)
	if err != nil {
		return nil, 0, err
	}

	db := u.DB.WithContext(ctx)
	products, total, err := u.ProductRepository.ListByStore(db, storeID, request)
	if err != nil {
		u.Log.Warnf("Failed to list products by store : %+v", err)
		return nil, 0, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan daftar produk")
	}

	return converter.ProductsToResponses(products), total, nil
}

func (u *ProductUseCase) Create(ctx context.Context, userID string, request *model.CreateProductRequest) (*model.ProductResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	storeID, err := u.getStoreID(ctx, userID)
	if err != nil {
		return nil, err
	}

	product := &entity.Product{
		ID:          uuid.NewString(),
		StoreID:     storeID,
		Name:        request.Name,
		Description: request.Description,
		Price:       request.Price,
		Stock:       request.Stock,
		ImageURL:    request.ImageURL,
	}

	db := u.DB.WithContext(ctx)
	tx := db.Begin()
	defer tx.Rollback()

	if err := u.ProductRepository.Create(tx, product); err != nil {
		u.Log.Warnf("Failed to create product : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat produk")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat produk")
	}

	return converter.ProductToResponse(product), nil
}

func (u *ProductUseCase) Update(ctx context.Context, userID string, productID string, request *model.UpdateProductRequest) (*model.ProductResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	storeID, err := u.getStoreID(ctx, userID)
	if err != nil {
		return nil, err
	}

	db := u.DB.WithContext(ctx)
	product := new(entity.Product)

	if err := u.ProductRepository.FindByStoreIDAndID(db, product, storeID, productID); err != nil {
		return nil, fiber.NewError(fiber.StatusNotFound, "Produk tidak ditemukan atau bukan milik Anda")
	}

	product.Name = request.Name
	product.Description = request.Description
	product.Price = request.Price
	product.Stock = request.Stock
	product.ImageURL = request.ImageURL

	tx := db.Begin()
	defer tx.Rollback()

	if err := u.ProductRepository.Update(tx, product); err != nil {
		u.Log.Warnf("Failed to update product : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui produk")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui produk")
	}

	return converter.ProductToResponse(product), nil
}

func (u *ProductUseCase) Delete(ctx context.Context, userID string, productID string) error {
	storeID, err := u.getStoreID(ctx, userID)
	if err != nil {
		return err
	}

	db := u.DB.WithContext(ctx)
	product := new(entity.Product)

	if err := u.ProductRepository.FindByStoreIDAndID(db, product, storeID, productID); err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Produk tidak ditemukan atau bukan milik Anda")
	}

	tx := db.Begin()
	defer tx.Rollback()

	if err := u.ProductRepository.Delete(tx, product); err != nil {
		u.Log.Warnf("Failed to delete product : %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal menghapus produk")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed commit transaction : %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal menghapus produk")
	}

	return nil
}
