package usecase

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/utils"
)

func (u *ProductUseCase) UploadImage(ctx context.Context, request *model.UploadImageRequest) (string, error) {
	tx := u.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	if request.ID != "" {
		product := new(entity.Product)
		// Fetch product to ensure ownership via store
		store := new(entity.Store)
		if err := u.StoreRepository.FindByUserID(tx, store, request.UserID); err != nil {
			return "", fiber.NewError(fiber.StatusNotFound, "Anda belum memiliki toko")
		}

		if err := u.ProductRepository.FindByIdWithStore(tx, product, request.ID); err != nil {
			u.Log.WithError(err).Error("error getting product")
		} else if product.StoreID == store.ID && product.ImageURL != "" {
			publicId := utils.ExtractPublicID(product.ImageURL)
			if err := u.UploadImageRepository.DeleteImage(ctx, publicId); err != nil {
				u.Log.WithError(err).Error("error delete old image")
			}
		}
	}

	imageUrl, err := u.UploadImageRepository.UploadImage(ctx, request.Image, "seapedia-assets/public/products")
	if err != nil {
		u.Log.WithError(err).Error("error uploading image")
		return "", fiber.NewError(fiber.StatusInternalServerError, "Failed to upload image")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.WithError(err).Error("error committing upload image")
		return "", fiber.NewError(fiber.StatusInternalServerError, "Failed to save image")
	}

	return imageUrl, nil
}
