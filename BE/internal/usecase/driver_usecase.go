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

type DriverUseCase struct {
	DB               *gorm.DB
	Log              *logrus.Logger
	OrderRepository  *repository.OrderRepository
	DeliveryRepository *repository.DeliveryRepository
}

func NewDriverUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	orderRepo *repository.OrderRepository,
	deliveryRepo *repository.DeliveryRepository,
) *DriverUseCase {
	return &DriverUseCase{
		DB:                 db,
		Log:                log,
		OrderRepository:    orderRepo,
		DeliveryRepository: deliveryRepo,
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
