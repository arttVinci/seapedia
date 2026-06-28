package usecase

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type SellerReportUseCase struct {
	DB              *gorm.DB
	Log             *logrus.Logger
	OrderRepository *repository.OrderRepository
	StoreRepository *repository.StoreRepository
}

func NewSellerReportUseCase(db *gorm.DB, log *logrus.Logger, orderRepo *repository.OrderRepository, storeRepo *repository.StoreRepository) *SellerReportUseCase {
	return &SellerReportUseCase{
		DB:              db,
		Log:             log,
		OrderRepository: orderRepo,
		StoreRepository: storeRepo,
	}
}

func (u *SellerReportUseCase) GetIncome(ctx context.Context, userID string) (*model.SellerIncomeResponse, error) {
	db := u.DB.WithContext(ctx)

	store := new(entity.Store)
	if err := u.StoreRepository.FindByUserID(db, store, userID); err != nil {
		u.Log.Warnf("Failed to find store by user id : %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Anda belum memiliki toko")
	}

	var totalIncome int64
	err := db.Model(&entity.Order{}).
		Where("store_id = ? AND status = ?", store.ID, "Pesanan Selesai").
		Select("COALESCE(SUM(subtotal - discount), 0)").
		Scan(&totalIncome).Error

	if err != nil {
		u.Log.Warnf("Failed to sum seller income : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan laporan pendapatan")
	}

	return &model.SellerIncomeResponse{
		TotalIncome: totalIncome,
	}, nil
}
