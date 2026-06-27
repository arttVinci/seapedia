package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"gorm.io/gorm"
)

type ProductRepository struct {
	Repository[entity.Product]
	Log *logrus.Logger
}

func NewProductRepository(log *logrus.Logger) *ProductRepository {
	return &ProductRepository{Log: log}
}

func (r *ProductRepository) Search(db *gorm.DB, request *model.SearchProductRequest) ([]entity.Product, int64, error) {
	var products []entity.Product
	err := db.Scopes(r.FilterProduct(request)).
		Offset((request.Page - 1) * request.Size).
		Limit(request.Size).
		Find(&products).Error
	if err != nil {
		return nil, 0, err
	}

	var total int64
	err = db.Model(&entity.Product{}).Scopes(r.FilterProduct(request)).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	return products, total, nil
}

func (r *ProductRepository) FilterProduct(request *model.SearchProductRequest) func(tx *gorm.DB) *gorm.DB {
	return func(tx *gorm.DB) *gorm.DB {
		if request.Name != "" {
			tx = tx.Where("name LIKE ?", "%"+request.Name+"%")
		}
		return tx
	}
}

func (r *ProductRepository) FindByIdWithStore(db *gorm.DB, product *entity.Product, id string) error {
	return db.Preload("Store").Where("id = ?", id).Take(product).Error
}
