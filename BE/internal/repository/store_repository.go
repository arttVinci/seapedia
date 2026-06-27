package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type StoreRepository struct {
	Repository[entity.Store]
	Log *logrus.Logger
}

func NewStoreRepository(log *logrus.Logger) *StoreRepository {
	return &StoreRepository{Log: log}
}

func (r *StoreRepository) FindByUserID(db *gorm.DB, store *entity.Store, userID string) error {
	return db.Where("user_id = ?", userID).Take(store).Error
}

func (r *StoreRepository) CountByName(db *gorm.DB, name string) (int64, error) {
	var count int64
	err := db.Model(&entity.Store{}).Where("name = ?", name).Count(&count).Error
	return count, err
}
