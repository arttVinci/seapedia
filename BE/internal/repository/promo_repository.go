package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type PromoRepository struct {
	Repository[entity.Promo]
	Log *logrus.Logger
}

func NewPromoRepository(log *logrus.Logger) *PromoRepository {
	return &PromoRepository{Log: log}
}

func (r *PromoRepository) FindByCode(db *gorm.DB, promo *entity.Promo, code string) error {
	return db.Where("code = ?", code).Take(promo).Error
}

func (r *PromoRepository) FindAll(db *gorm.DB) ([]entity.Promo, error) {
	var promos []entity.Promo
	err := db.Find(&promos).Error
	return promos, err
}
