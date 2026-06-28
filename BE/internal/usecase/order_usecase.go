package usecase

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type OrderUseCase struct {
	DB              *gorm.DB
	Log             *logrus.Logger
	OrderRepository *repository.OrderRepository
}

func NewOrderUseCase(db *gorm.DB, log *logrus.Logger, orderRepo *repository.OrderRepository) *OrderUseCase {
	return &OrderUseCase{
		DB:              db,
		Log:             log,
		OrderRepository: orderRepo,
	}
}

func (u *OrderUseCase) ListBuyerOrders(ctx context.Context, userID string) ([]model.OrderResponse, error) {
	db := u.DB.WithContext(ctx)

	orders, err := u.OrderRepository.ListByBuyer(db, userID)
	if err != nil {
		u.Log.Warnf("Failed to list buyer orders : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan riwayat pesanan")
	}

	return converter.OrdersToResponses(orders), nil
}

func (u *OrderUseCase) GetBuyerOrderDetail(ctx context.Context, userID string, orderID string) (*model.OrderDetailResponse, error) {
	db := u.DB.WithContext(ctx)

	order, err := u.OrderRepository.FindByBuyerAndID(db, userID, orderID)
	if err != nil {
		u.Log.Warnf("Failed to find buyer order : %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Pesanan tidak ditemukan")
	}

	return converter.OrderToDetailResponse(order), nil
}