package usecase

import (
	"context"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type DriverUseCase struct {
	DB                          *gorm.DB
	Log                         *logrus.Logger
	OrderRepository             *repository.OrderRepository
	DeliveryRepository          *repository.DeliveryRepository
	OrderStatusHistoryRepo      *repository.OrderStatusHistoryRepository
	WalletRepository            *repository.WalletRepository
	WalletTransactionRepository *repository.WalletTransactionRepository
	StoreRepository             *repository.StoreRepository
}

func NewDriverUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	orderRepo *repository.OrderRepository,
	deliveryRepo *repository.DeliveryRepository,
	orderStatusHistoryRepo *repository.OrderStatusHistoryRepository,
	walletRepo *repository.WalletRepository,
	walletTxRepo *repository.WalletTransactionRepository,
	storeRepo *repository.StoreRepository,
) *DriverUseCase {
	return &DriverUseCase{
		DB:                          db,
		Log:                         log,
		OrderRepository:             orderRepo,
		DeliveryRepository:          deliveryRepo,
		OrderStatusHistoryRepo:      orderStatusHistoryRepo,
		WalletRepository:            walletRepo,
		WalletTransactionRepository: walletTxRepo,
		StoreRepository:             storeRepo,
	}
}

func (u *DriverUseCase) ListJobs(ctx context.Context) ([]model.JobResponse, error) {

	db := u.DB.WithContext(ctx)

	orders, err := u.OrderRepository.ListAvailableJobs(db)
	if err != nil {
		u.Log.Warnf("Failed to list available jobs: %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memuat daftar pekerjaan")
	}

	return converter.OrdersToJobResponses(orders), nil
}

func (u *DriverUseCase) JobDetail(ctx context.Context, orderID string) (*model.OrderDetailResponse, error) {
	db := u.DB.WithContext(ctx)

	order, err := u.OrderRepository.FindJobByID(db, orderID)
	if err != nil {
		u.Log.Warnf("Failed to find job detail: %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Pekerjaan tidak ditemukan atau sudah diambil")
	}

	return converter.OrderToDetailResponse(order), nil
}

func (u *DriverUseCase) TakeJob(ctx context.Context, userID, orderID string) error {
	db := u.DB.WithContext(ctx)

	tx := db.Begin()
	defer tx.Rollback()

	// 1. TakeJob via DeliveryRepository using optimistic locking
	err := u.DeliveryRepository.TakeAtomic(tx, orderID, userID)
	if err != nil {
		u.Log.Warnf("Failed to take job: %+v", err)
		if err == gorm.ErrRecordNotFound {
			return fiber.NewError(fiber.StatusConflict, "Pekerjaan sudah diambil oleh pengemudi lain atau tidak tersedia")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mengambil pekerjaan")
	}

	// 2. Update order status to "Sedang Dikirim"
	order := new(entity.Order)
	if err := u.OrderRepository.FindById(tx, order, orderID); err != nil {
		u.Log.Warnf("Failed to find order after take job: %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memproses pesanan")
	}

	order.Status = "Sedang Dikirim"
	if err := u.OrderRepository.Update(tx, order); err != nil {
		u.Log.Warnf("Failed to update order status: %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui status pesanan")
	}

	// 3. Create status history
	history := &entity.OrderStatusHistory{
		ID:      uuid.NewString(),
		OrderID: order.ID,
		Status:  order.Status,
		Note:    "Pesanan sedang dalam perjalanan",
	}

	if err := u.OrderStatusHistoryRepo.Create(tx, history); err != nil {
		u.Log.Warnf("Failed to create status history: %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mencatat riwayat status")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed to commit transaction: %+v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal menyelesaikan pengambilan pekerjaan")
	}

	return nil
}

func (u *DriverUseCase) Dashboard(ctx context.Context, userID string) (*model.DashboardResponse, error) {
	db := u.DB.WithContext(ctx)
	
	// Get all deliveries for the driver
	var deliveries []entity.Delivery
	if err := db.Where("driver_id = ?", userID).Order("created_at desc").Find(&deliveries).Error; err != nil {
		u.Log.Warnf("Failed to fetch deliveries: %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memuat dashboard")
	}

	response := &model.DashboardResponse{
		CompletedToday: 0,
		TotalEarning:   0,
		RecentJobs:     []model.RecentJobResponse{},
	}

	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location()).UnixMilli()
	endOfDay := time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 999, now.Location()).UnixMilli()

	for _, d := range deliveries {
		var order entity.Order
		if err := u.OrderRepository.FindById(db, &order, d.OrderID); err != nil {
			continue
		}

		if d.Status == "Sedang Dikirim" {
			response.ActiveJob = &model.DashboardActiveJob{
				OrderID:        order.ID,
				StoreID:        order.StoreID,
				DeliveryMethod: order.DeliveryMethod,
				DeliveryFee:    order.DeliveryFee,
				TakenAt:        d.TakenAt,
			}
		}

		if d.Status == "Pesanan Selesai" {
			response.TotalEarning += d.Earning
			if d.CompletedAt != nil && *d.CompletedAt >= startOfDay && *d.CompletedAt <= endOfDay {
				response.CompletedToday++
			}
		}

		// limit recent jobs to last 10
		if len(response.RecentJobs) < 10 {
			response.RecentJobs = append(response.RecentJobs, model.RecentJobResponse{
				OrderID:       order.ID,
				Status:        order.Status,
				DeliveryFee:   order.DeliveryFee,
				DriverEarning: d.Earning,
				CompletedAt:   d.CompletedAt,
			})
		}
	}

	return response, nil
}

func (u *DriverUseCase) CompleteJob(ctx context.Context, userID, orderID string) (*model.CompleteJobResponse, error) {
	db := u.DB.WithContext(ctx)

	tx := db.Begin()
	defer tx.Rollback()

	// 1. Validasi Order dan Delivery
	var order entity.Order
	if err := u.OrderRepository.FindById(tx, &order, orderID); err != nil {
		u.Log.Warnf("Failed to find order: %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Pesanan tidak ditemukan")
	}

	if order.Status != "Sedang Dikirim" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Pesanan tidak dapat diselesaikan karena status saat ini: "+order.Status)
	}

	delivery, err := u.DeliveryRepository.FindByOrderID(tx, orderID)
	if err != nil {
		u.Log.Warnf("Failed to find delivery: %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Data pengiriman tidak ditemukan")
	}

	if delivery.DriverID == nil || *delivery.DriverID != userID {
		return nil, fiber.NewError(fiber.StatusForbidden, "Pekerjaan ini tidak diambil oleh Anda")
	}

	if delivery.Status != "Sedang Dikirim" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Pekerjaan ini tidak sedang diproses")
	}

	// 2. Update Delivery
	now := time.Now().UnixMilli()
	driverEarning := int64(float64(order.DeliveryFee) * 0.8)

	delivery.Status = "Pesanan Selesai"
	delivery.CompletedAt = &now
	delivery.Earning = driverEarning

	if err := u.DeliveryRepository.Update(tx, delivery); err != nil {
		u.Log.Warnf("Failed to update delivery: %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menyelesaikan pengiriman")
	}

	// 3. Update Order Status
	order.Status = "Pesanan Selesai"
	if err := u.OrderRepository.Update(tx, &order); err != nil {
		u.Log.Warnf("Failed to update order status: %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui status pesanan")
	}

	// 4. Create Order Status History
	history := &entity.OrderStatusHistory{
		ID:      uuid.NewString(),
		OrderID: order.ID,
		Status:  order.Status,
		Note:    "Pesanan telah berhasil dikirim dan diterima oleh pembeli",
	}

	if err := u.OrderStatusHistoryRepo.Create(tx, history); err != nil {
		u.Log.Warnf("Failed to create status history: %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mencatat riwayat status")
	}

	// 5. Tambah saldo ke dompet Driver
	if err := u.addWalletBalance(tx, userID, int(driverEarning), "Pendapatan dari pengiriman pesanan "+order.ID); err != nil {
		return nil, err
	}

	// 6. Tambah saldo ke dompet Seller
	var store entity.Store
	if err := u.StoreRepository.FindById(tx, &store, order.StoreID); err != nil {
		u.Log.Warnf("Failed to find store: %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menemukan data toko")
	}

	sellerEarning := order.Subtotal - order.Discount
	if err := u.addWalletBalance(tx, store.UserID, int(sellerEarning), "Pendapatan dari pesanan "+order.ID); err != nil {
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed to commit transaction: %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menyelesaikan pekerjaan")
	}

	return &model.CompleteJobResponse{
		Success:       true,
		DriverEarning: driverEarning,
	}, nil
}

func (u *DriverUseCase) addWalletBalance(tx *gorm.DB, userID string, amount int, description string) error {
	wallet := new(entity.Wallet)
	err := u.WalletRepository.FindByUserIDForUpdate(tx, wallet, userID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			wallet = &entity.Wallet{
				ID:      uuid.NewString(),
				UserID:  userID,
				Balance: 0,
			}
			if err := u.WalletRepository.Create(tx, wallet); err != nil {
				u.Log.Warnf("Failed to create wallet for user %s: %+v", userID, err)
				return fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat dompet")
			}
		} else {
			u.Log.Warnf("Failed to find wallet for update for user %s: %+v", userID, err)
			return fiber.NewError(fiber.StatusInternalServerError, "Gagal mengakses dompet")
		}
	}

	wallet.Balance += amount
	if err := u.WalletRepository.Update(tx, wallet); err != nil {
		u.Log.Warnf("Failed to update wallet balance for user %s: %+v", userID, err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui saldo dompet")
	}

	transaction := &entity.WalletTransaction{
		ID:          uuid.NewString(),
		WalletID:    wallet.ID,
		Type:        "income",
		Amount:      amount,
		Description: description,
	}
	if err := u.WalletTransactionRepository.Create(tx, transaction); err != nil {
		u.Log.Warnf("Failed to insert wallet transaction for user %s: %+v", userID, err)
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mencatat transaksi")
	}

	return nil
}

