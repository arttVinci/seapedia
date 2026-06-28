package usecase

import (
	"context"

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
	DB               *gorm.DB
	Log              *logrus.Logger
	OrderRepository  *repository.OrderRepository
	DeliveryRepository *repository.DeliveryRepository
	OrderStatusHistoryRepo *repository.OrderStatusHistoryRepository
}

func NewDriverUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	orderRepo *repository.OrderRepository,
	deliveryRepo *repository.DeliveryRepository,
	orderStatusHistoryRepo *repository.OrderStatusHistoryRepository,
) *DriverUseCase {
	return &DriverUseCase{
		DB:                 db,
		Log:                log,
		OrderRepository:    orderRepo,
		DeliveryRepository: deliveryRepo,
		OrderStatusHistoryRepo: orderStatusHistoryRepo,
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

