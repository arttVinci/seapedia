package usecase

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type SellerOrderUseCase struct {
	DB                           *gorm.DB
	Log                          *logrus.Logger
	OrderRepository              *repository.OrderRepository
	StoreRepository              *repository.StoreRepository
	OrderStatusHistoryRepository *repository.OrderStatusHistoryRepository
}

func NewSellerOrderUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	orderRepo *repository.OrderRepository,
	storeRepo *repository.StoreRepository,
	orderStatusHistoryRepo *repository.OrderStatusHistoryRepository,
) *SellerOrderUseCase {
	return &SellerOrderUseCase{
		DB:                           db,
		Log:                          log,
		OrderRepository:              orderRepo,
		StoreRepository:              storeRepo,
		OrderStatusHistoryRepository: orderStatusHistoryRepo,
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

func (u *SellerOrderUseCase) ProcessOrder(ctx context.Context, userID string, orderID string) error {
	db := u.DB.WithContext(ctx)

	store := new(entity.Store)
	if err := u.StoreRepository.FindByUserID(db, store, userID); err != nil {
		u.Log.Warnf("Failed to find store by user id : %+v", err)
		return fiber.NewError(fiber.StatusNotFound, "Anda belum memiliki toko")
	}

	tx := db.Begin()
	defer tx.Rollback()

	var order entity.Order
	// Using Row-level locking to avoid race condition during status change
	err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("store_id = ? AND id = ?", store.ID, orderID).Take(&order).Error
	if err != nil {
		u.Log.Warnf("Failed to find order : %+v", err)
		return fiber.NewError(fiber.StatusNotFound, "Pesanan tidak ditemukan")
	}

	if order.Status != "Sedang Dikemas" {
		return fiber.NewError(fiber.StatusBadRequest, "Pesanan tidak dapat diproses karena status saat ini adalah: "+order.Status)
	}

	order.Status = "Menunggu Pengiriman"
	if err := u.OrderRepository.Update(tx, &order); err != nil {
		u.Log.Warnf("Failed to update order status : %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memproses pesanan")
	}

	history := &entity.OrderStatusHistory{
		ID:      uuid.NewString(),
		OrderID: order.ID,
		Status:  order.Status,
		Note:    "Pesanan sedang menunggu penjemputan oleh driver",
	}

	if err := u.OrderStatusHistoryRepository.Create(tx, history); err != nil {
		u.Log.Warnf("Failed to create status history : %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mencatat riwayat status")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed to commit transaction : %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memproses pesanan")
	}

	return nil
}
