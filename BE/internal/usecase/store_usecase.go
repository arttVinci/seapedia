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

func (u *StoreUseCase) FindAll(ctx context.Context) ([]model.StoreResponse, error) {
	db := u.DB.WithContext(ctx)
	stores, err := u.StoreRepository.FindAll(db)
	if err != nil {
		u.Log.Warnf("Failed to list stores : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memuat daftar toko")
	}
	return converter.StoresToResponses(stores), nil
}

func (u *StoreUseCase) FindByUserID(ctx context.Context, userID string) (*model.StoreResponse, error) {
	db := u.DB.WithContext(ctx)
	store := new(entity.Store)
	if err := u.StoreRepository.FindByUserID(db, store, userID); err != nil {
		u.Log.Warnf("Failed to find store by user id : %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Anda belum memiliki toko")
	}
	return converter.StoreToResponse(store), nil
}

func (u *StoreUseCase) Create(ctx context.Context, userID string, request *model.CreateStoreRequest) (*model.StoreResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	db := u.DB.WithContext(ctx)

	// Cek apakah user sudah punya toko
	existing := new(entity.Store)
	if err := u.StoreRepository.FindByUserID(db, existing, userID); err == nil {
		return nil, fiber.NewError(fiber.StatusConflict, "Anda sudah memiliki toko")
	}

	// Cek nama toko unik
	count, err := u.StoreRepository.CountByName(db, request.Name)
	if err != nil {
		u.Log.Warnf("Failed to count store by name : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memeriksa nama toko")
	}
	if count > 0 {
		return nil, fiber.NewError(fiber.StatusConflict, "Nama toko sudah digunakan")
	}

	store := &entity.Store{
		ID:          uuid.NewString(),
		UserID:      userID,
		Name:        request.Name,
		Description: request.Description,
	}

	tx := db.Begin()
	defer tx.Rollback()

	if err := u.StoreRepository.Create(tx, store); err != nil {
		u.Log.Warnf("Failed to create store : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat toko")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat toko")
	}

	return converter.StoreToResponse(store), nil
}

func (u *StoreUseCase) Update(ctx context.Context, userID string, request *model.UpdateStoreRequest) (*model.StoreResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	db := u.DB.WithContext(ctx)

	store := new(entity.Store)
	if err := u.StoreRepository.FindByUserID(db, store, userID); err != nil {
		u.Log.Warnf("Failed to find store by user id : %+v", err)
		return nil, fiber.NewError(fiber.StatusNotFound, "Anda belum memiliki toko")
	}

	// Jika nama berubah, cek keunikan
	if store.Name != request.Name {
		count, err := u.StoreRepository.CountByName(db, request.Name)
		if err != nil {
			u.Log.Warnf("Failed to count store by name : %+v", err)
			return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memeriksa nama toko")
		}
		if count > 0 {
			return nil, fiber.NewError(fiber.StatusConflict, "Nama toko sudah digunakan")
		}
	}

	store.Name = request.Name
	store.Description = request.Description

	tx := db.Begin()
	defer tx.Rollback()

	if err := u.StoreRepository.Update(tx, store); err != nil {
		u.Log.Warnf("Failed to update store : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui toko")
	}

	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui toko")
	}

	return converter.StoreToResponse(store), nil
}
