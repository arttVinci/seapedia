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

type BuyerReportUseCase struct {
	DB              *gorm.DB
	Log             *logrus.Logger
	OrderRepository *repository.OrderRepository
}

func NewBuyerReportUseCase(db *gorm.DB, log *logrus.Logger, orderRepo *repository.OrderRepository) *BuyerReportUseCase {
	return &BuyerReportUseCase{
		DB:              db,
		Log:             log,
		OrderRepository: orderRepo,
	}
}

func (u *BuyerReportUseCase) GetExpense(ctx context.Context, buyerID string) (*model.BuyerExpenseResponse, error) {
	db := u.DB.WithContext(ctx)

	var totalExpense int64
	err := db.Model(&entity.Order{}).
		Where("buyer_id = ? AND status != ?", buyerID, "Dikembalikan").
		Select("COALESCE(SUM(final_total), 0)").
		Scan(&totalExpense).Error

	if err != nil {
		u.Log.Warnf("Failed to sum buyer expense : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan laporan pengeluaran")
	}

	return &model.BuyerExpenseResponse{
		TotalExpense: totalExpense,
	}, nil
}
