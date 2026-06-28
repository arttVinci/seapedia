package usecase

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type SellerOrderUseCase struct {
	DB              *gorm.DB
	Log             *logrus.Logger
	OrderRepository *repository.OrderRepository
	StoreRepository *repository.StoreRepository
}

func NewSellerOrderUseCase(db *gorm.DB, log *logrus.Logger, orderRepo *repository.OrderRepository, storeRepo *repository.StoreRepository) *SellerOrderUseCase {
	return &SellerOrderUseCase{
		DB:              db,
		Log:             log,
		OrderRepository: orderRepo,
		StoreRepository: storeRepo,
	}
}

func (u *SellerOrderUseCase) ListSellerOrders(ctx context.Context, userID string) ([]model.OrderResponse, error) {
	db := u.DB.WithContext(ctx)

	store := new(entity.Store)
	if err := u.StoreRepository.FindByUserID(db, store, userID); err != nil {
		u.Log.Warnf("Failed to find store by user id : %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Anda belum memiliki toko")
	}

	var orders []entity.Order
	if err := db.Where("store_id = ?", store.ID).Order("created_at desc").Find(&orders).Error; err != nil {
		u.Log.Warnf("Failed to list seller orders : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan riwayat pesanan")
	}

	return converter.OrdersToResponses(orders), nil
}
