package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/repository"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type AdminUseCase struct {
	DB                     *gorm.DB
	Log                    *logrus.Logger
	OrderRepository        *repository.OrderRepository
	OrderItemRepository    *repository.OrderItemRepository
	WalletRepository       *repository.WalletRepository
	WalletTransactionRepo  *repository.WalletTransactionRepository
	ProductRepository      *repository.ProductRepository
	OrderStatusHistoryRepo *repository.OrderStatusHistoryRepository
	UserRepository         *repository.UserRepository
	StoreRepository        *repository.StoreRepository
	VoucherRepository      *repository.VoucherRepository
	PromoRepository        *repository.PromoRepository
	DeliveryRepository     *repository.DeliveryRepository
}

func NewAdminUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	orderRepo *repository.OrderRepository,
	orderItemRepo *repository.OrderItemRepository,
	walletRepo *repository.WalletRepository,
	walletTxRepo *repository.WalletTransactionRepository,
	productRepo *repository.ProductRepository,
	orderStatusHistoryRepo *repository.OrderStatusHistoryRepository,
	userRepo *repository.UserRepository,
	storeRepo *repository.StoreRepository,
	voucherRepo *repository.VoucherRepository,
	promoRepo *repository.PromoRepository,
	deliveryRepo *repository.DeliveryRepository,
) *AdminUseCase {
	return &AdminUseCase{
		DB:                     db,
		Log:                    log,
		OrderRepository:        orderRepo,
		OrderItemRepository:    orderItemRepo,
		WalletRepository:       walletRepo,
		WalletTransactionRepo:  walletTxRepo,
		ProductRepository:      productRepo,
		OrderStatusHistoryRepo: orderStatusHistoryRepo,
		UserRepository:         userRepo,
		StoreRepository:        storeRepo,
		VoucherRepository:      voucherRepo,
		PromoRepository:        promoRepo,
		DeliveryRepository:     deliveryRepo,
	}
}

func (u *AdminUseCase) SimulateNextDay(ctx context.Context) (*model.SimulateNextDayResponse, error) {
	var processedCount int
	var currentDay int

	err := u.DB.Transaction(func(tx *gorm.DB) error {
		// 1. Advance the clock
		var systemState entity.SystemState
		if err := tx.First(&systemState, 1).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				systemState = entity.SystemState{ID: 1, CurrentSimulatedDay: 1}
				if err := tx.Create(&systemState).Error; err != nil {
					return err
				}
			} else {
				return err
			}
		}

		currentDay = systemState.CurrentSimulatedDay + 1
		systemState.CurrentSimulatedDay = currentDay
		if err := tx.Save(&systemState).Error; err != nil {
			return err
		}

		// 2. Find overdue orders
		// Status "Sedang Dikemas" or "Menunggu Pengirim" means it hasn't been picked up by a driver yet.
		// If it is overdue, we refund.
		var overdueOrders []entity.Order
		if err := tx.Where("status IN ? AND due_simulated_day < ?", []string{"Sedang Dikemas", "Menunggu Pengirim"}, systemState.CurrentSimulatedDay).Preload("Items").Find(&overdueOrders).Error; err != nil {
			return err
		}

		for _, order := range overdueOrders {
			// Update Status
			order.Status = "Dikembalikan"
			if err := tx.Save(&order).Error; err != nil {
				return err
			}

			// Add History
			history := entity.OrderStatusHistory{
				ID:        uuid.NewString(),
				OrderID:   order.ID,
				Status:    "Dikembalikan",
				Note:      "Pesanan dibatalkan karena melebihi batas waktu pengiriman (SLA Overdue)",
				CreatedAt: time.Now().UnixMilli(),
			}
			if err := tx.Create(&history).Error; err != nil {
				return err
			}

			// Refund to Wallet
			var wallet entity.Wallet
			if err := tx.Where("user_id = ?", order.BuyerID).First(&wallet).Error; err != nil {
				return err
			}

			wallet.Balance += int(order.FinalTotal)
			if err := tx.Save(&wallet).Error; err != nil {
				return err
			}

			// Record Transaction
			walletTx := entity.WalletTransaction{
				ID:          uuid.NewString(),
				WalletID:    wallet.ID,
				Amount:      int(order.FinalTotal),
				Type:        "refund",
				Description: "Pengembalian dana untuk pesanan " + order.ID + " (Overdue)",
				CreatedAt:   time.Now().UnixMilli(),
			}
			if err := tx.Create(&walletTx).Error; err != nil {
				return err
			}

			// Restore Stock
			for _, item := range order.Items {
				var product entity.Product
				if err := tx.First(&product, "id = ?", item.ProductID).Error; err == nil {
					product.Stock += item.Quantity
					tx.Save(&product)
				}
			}

			processedCount++
		}

		return nil
	})

	if err != nil {
		u.Log.Errorf("Failed to simulate next day: %+v", err)
		return nil, err
	}

	return &model.SimulateNextDayResponse{
		CurrentSimulatedDay: currentDay,
		ProcessedOverdue:    processedCount,
	}, nil
}

func (u *AdminUseCase) GetDashboardStats(ctx context.Context) (*model.DashboardStatsResponse, error) {
	var stats model.DashboardStatsResponse

	stats.TotalUsers, _ = u.UserRepository.Count(u.DB)
	stats.TotalStores, _ = u.StoreRepository.Count(u.DB)
	stats.TotalProducts, _ = u.ProductRepository.Count(u.DB)
	stats.TotalOrders, _ = u.OrderRepository.Count(u.DB)
	stats.TotalVouchers, _ = u.VoucherRepository.Count(u.DB)
	stats.TotalPromos, _ = u.PromoRepository.Count(u.DB)
	stats.TotalDeliveryJobs, _ = u.DeliveryRepository.Count(u.DB)

	var systemState entity.SystemState
	if err := u.DB.First(&systemState, 1).Error; err == nil {
		stats.CurrentSimulatedDay = systemState.CurrentSimulatedDay
	} else {
		stats.CurrentSimulatedDay = 1
	}

	return &stats, nil
}
