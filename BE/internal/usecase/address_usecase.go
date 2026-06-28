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

type AddressUseCase struct {
	DB                *gorm.DB
	Log               *logrus.Logger
	Validate          *validator.Validate
	AddressRepository *repository.AddressRepository
}

func NewAddressUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	validate *validator.Validate,
	addressRepository *repository.AddressRepository,
) *AddressUseCase {
	return &AddressUseCase{
		DB:                db,
		Log:               log,
		Validate:          validate,
		AddressRepository: addressRepository,
	}
}

func (c *AddressUseCase) List(ctx context.Context, userID string) ([]model.AddressResponse, error) {
	addresses, err := c.AddressRepository.FindByUserID(c.DB, userID)
	if err != nil {
		c.Log.WithError(err).Error("failed to get user addresses")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mengambil daftar alamat")
	}

	return converter.AddressesToResponse(addresses), nil
}

func (c *AddressUseCase) Create(ctx context.Context, userID string, request *model.CreateAddressRequest) (*model.AddressResponse, error) {
	if err := c.Validate.Struct(request); err != nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	tx := c.DB.Begin()
	defer tx.Rollback()

	address := &entity.Address{
		ID:          uuid.NewString(),
		UserID:      userID,
		Label:       request.Label,
		Recipient:   request.Recipient,
		Phone:       request.Phone,
		FullAddress: request.FullAddress,
	}

	if err := c.AddressRepository.Create(tx, address); err != nil {
		c.Log.WithError(err).Error("failed to create address")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat alamat baru")
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.WithError(err).Error("failed to commit address creation")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menyimpan alamat")
	}

	return converter.AddressToResponse(address), nil
}

func (c *AddressUseCase) Update(ctx context.Context, userID string, addressID string, request *model.UpdateAddressRequest) (*model.AddressResponse, error) {
	if err := c.Validate.Struct(request); err != nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	tx := c.DB.Begin()
	defer tx.Rollback()

	address := new(entity.Address)
	if err := c.AddressRepository.FindByIDAndUserID(tx, address, addressID, userID); err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, fiber.NewError(fiber.StatusNotFound, "Alamat tidak ditemukan")
		}
		c.Log.WithError(err).Error("failed to find address")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mengakses data alamat")
	}

	address.Label = request.Label
	address.Recipient = request.Recipient
	address.Phone = request.Phone
	address.FullAddress = request.FullAddress

	if err := c.AddressRepository.Update(tx, address); err != nil {
		c.Log.WithError(err).Error("failed to update address")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui alamat")
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.WithError(err).Error("failed to commit address update")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal menyimpan perubahan alamat")
	}

	return converter.AddressToResponse(address), nil
}

func (c *AddressUseCase) Delete(ctx context.Context, userID string, addressID string) error {
	tx := c.DB.Begin()
	defer tx.Rollback()

	address := new(entity.Address)
	if err := c.AddressRepository.FindByIDAndUserID(tx, address, addressID, userID); err != nil {
		if err == gorm.ErrRecordNotFound {
			return fiber.NewError(fiber.StatusNotFound, "Alamat tidak ditemukan")
		}
		c.Log.WithError(err).Error("failed to find address")
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mengakses data alamat")
	}

	if err := c.AddressRepository.Delete(tx, address); err != nil {
		c.Log.WithError(err).Error("failed to delete address")
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal menghapus alamat")
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.WithError(err).Error("failed to commit address deletion")
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memproses penghapusan alamat")
	}

	return nil
}
