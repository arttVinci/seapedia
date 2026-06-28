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

type PromoUseCase struct {
	DB              *gorm.DB
	Log             *logrus.Logger
	Validate        *validator.Validate
	PromoRepository *repository.PromoRepository
}

func NewPromoUseCase(db *gorm.DB, log *logrus.Logger, validate *validator.Validate, promoRepo *repository.PromoRepository) *PromoUseCase {
	return &PromoUseCase{DB: db, Log: log, Validate: validate, PromoRepository: promoRepo}
}

func (u *PromoUseCase) Create(ctx context.Context, request *model.CreatePromoRequest) (*model.PromoResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	db := u.DB.WithContext(ctx)

	// Check unique code
	existing := new(entity.Promo)
	if err := u.PromoRepository.FindByCode(db, existing, request.Code); err == nil {
		return nil, fiber.NewError(fiber.StatusConflict, "Kode promo sudah digunakan")
	}

	promo := &entity.Promo{
		ID:             uuid.NewString(),
		Code:           request.Code,
		DiscountAmount: request.DiscountAmount,
		ExpiredAt:      request.ExpiredAt,
	}

	tx := db.Begin()
	defer tx.Rollback()

	if err := u.PromoRepository.Create(tx, promo); err != nil {
		u.Log.Warnf("Failed to create promo : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat promo")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat promo")
	}

	return converter.PromoToResponse(promo), nil
}

func (u *PromoUseCase) FindAll(ctx context.Context) ([]model.PromoResponse, error) {
	db := u.DB.WithContext(ctx)
	promos, err := u.PromoRepository.FindAll(db)
	if err != nil {
		u.Log.Warnf("Failed to find all promos : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan daftar promo")
	}
	return converter.PromosToResponses(promos), nil
}

func (u *PromoUseCase) FindById(ctx context.Context, id string) (*model.PromoResponse, error) {
	db := u.DB.WithContext(ctx)
	promo := new(entity.Promo)
	if err := u.PromoRepository.FindById(db, promo, id); err != nil {
		u.Log.Warnf("Failed to find promo by id : %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Promo tidak ditemukan")
	}
	return converter.PromoToResponse(promo), nil
}
