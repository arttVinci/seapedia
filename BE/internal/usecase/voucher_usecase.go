package usecase

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type VoucherUseCase struct {
	DB                *gorm.DB
	Log               *logrus.Logger
	Validate          *validator.Validate
	VoucherRepository *repository.VoucherRepository
}

func NewVoucherUseCase(db *gorm.DB, log *logrus.Logger, validate *validator.Validate, voucherRepo *repository.VoucherRepository) *VoucherUseCase {
	return &VoucherUseCase{DB: db, Log: log, Validate: validate, VoucherRepository: voucherRepo}
}

func (u *VoucherUseCase) Create(ctx context.Context, request *model.CreateVoucherRequest) (*model.VoucherResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	db := u.DB.WithContext(ctx)

	// Check unique code
	existing := new(entity.Voucher)
	if err := u.VoucherRepository.FindByCode(db, existing, request.Code); err == nil {
		return nil, fiber.NewError(fiber.StatusConflict, "Kode voucher sudah digunakan")
	}

	voucher := &entity.Voucher{
		ID:             uuid.NewString(),
		Code:           request.Code,
		DiscountAmount: request.DiscountAmount,
		ExpiredAt:      request.ExpiredAt,
		RemainingUsage: request.RemainingUsage,
	}

	tx := db.Begin()
	defer tx.Rollback()

	if err := u.VoucherRepository.Create(tx, voucher); err != nil {
		u.Log.Warnf("Failed to create voucher : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat voucher")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat voucher")
	}

	return converter.VoucherToResponse(voucher), nil
}

func (u *VoucherUseCase) FindAll(ctx context.Context) ([]model.VoucherResponse, error) {
	db := u.DB.WithContext(ctx)
	vouchers, err := u.VoucherRepository.FindAll(db)
	if err != nil {
		u.Log.Warnf("Failed to find all vouchers : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan daftar voucher")
	}
	return converter.VouchersToResponses(vouchers), nil
}

func (u *VoucherUseCase) FindById(ctx context.Context, id string) (*model.VoucherResponse, error) {
	db := u.DB.WithContext(ctx)
	voucher := new(entity.Voucher)
	if err := u.VoucherRepository.FindById(db, voucher, id); err != nil {
		u.Log.Warnf("Failed to find voucher by id : %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Voucher tidak ditemukan")
	}
	return converter.VoucherToResponse(voucher), nil
}
