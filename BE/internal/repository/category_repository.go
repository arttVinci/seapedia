package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type CategoryRepository struct {
	Repository[entity.Category]
	Log *logrus.Logger
}

func NewCategoryRepository(log *logrus.Logger) *CategoryRepository {
	return &CategoryRepository{Log: log}
}

func (r *CategoryRepository) GetAll(db *gorm.DB) ([]entity.Category, error) {
	var categories []entity.Category
	err := db.Order("name ASC").Find(&categories).Error
	if err != nil {
		return nil, err
	}
	return categories, nil
}
