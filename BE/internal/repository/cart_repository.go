package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type CartRepository struct {
	Repository[entity.Cart]
	Log *logrus.Logger
}

func NewCartRepository(log *logrus.Logger) *CartRepository {
	return &CartRepository{
		Log: log,
	}
}

func (r *CartRepository) FindByUserID(db *gorm.DB, userID string) (*entity.Cart, error) {
	var cart entity.Cart
	err := db.Preload("Store").
		Preload("CartItems").
		Preload("CartItems.Product").
		Where("user_id = ?", userID).First(&cart).Error
	if err != nil {
		return nil, err
	}
	return &cart, nil
}
