package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type AddressRepository struct {
	Repository[entity.Address]
	Log *logrus.Logger
}

func NewAddressRepository(log *logrus.Logger) *AddressRepository {
	return &AddressRepository{
		Log: log,
	}
}

func (r *AddressRepository) FindByUserID(db *gorm.DB, userID string) ([]entity.Address, error) {
	var addresses []entity.Address
	err := db.Where("user_id = ?", userID).Find(&addresses).Error
	return addresses, err
}

func (r *AddressRepository) FindByIDAndUserID(db *gorm.DB, address *entity.Address, id string, userID string) error {
	return db.Where("id = ? AND user_id = ?", id, userID).Take(address).Error
}
