package usecase

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type StoreUseCase struct {
	DB              *gorm.DB
	Log             *logrus.Logger
	Validate        *validator.Validate
	StoreRepository *repository.StoreRepository
}

func NewStoreUseCase(db *gorm.DB, log *logrus.Logger, validate *validator.Validate, storeRepo *repository.StoreRepository) *StoreUseCase {
	return &StoreUseCase{DB: db, Log: log, Validate: validate, StoreRepository: storeRepo}
}

func (u *StoreUseCase) FindById(ctx context.Context, id string) (*model.StoreResponse, error) {
	db := u.DB.WithContext(ctx)
	store := new(entity.Store)
	if err := u.StoreRepository.FindById(db, store, id); err != nil {
		u.Log.Warnf("Failed to find store by id : %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Toko tidak ditemukan")
	}
	return converter.StoreToResponse(store), nil
}
