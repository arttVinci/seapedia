package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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
	query := db.Scopes(r.FilterProduct(request)).Preload("Categories")
	
	switch request.Sort {
	case "price_desc":
		query = query.Order("price desc")
	case "price_asc":
		query = query.Order("price asc")
	default:
		query = query.Order("created_at desc")
	}

	err := query.
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
		if len(request.Category) > 0 {
			tx = tx.Where("EXISTS (SELECT 1 FROM product_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.product_id = products.id AND c.name IN ?)", request.Category)
		}
		return tx
	}
}

func (r *ProductRepository) FindByIdWithStore(db *gorm.DB, product *entity.Product, id string) error {
	return db.Preload("Store").Preload("Categories").Where("id = ?", id).Take(product).Error
}

func (r *ProductRepository) FilterSellerProduct(request *model.SellerProductSearchRequest) func(tx *gorm.DB) *gorm.DB {
	return func(tx *gorm.DB) *gorm.DB {
		if request.Name != "" {
			tx = tx.Where("name LIKE ?", "%"+request.Name+"%")
		}
		if len(request.Category) > 0 {
			tx = tx.Where("EXISTS (SELECT 1 FROM product_categories pc JOIN categories c ON c.id = pc.category_id WHERE pc.product_id = products.id AND c.name IN ?)", request.Category)
		}
		return tx
	}
}

func (r *ProductRepository) ListByStore(db *gorm.DB, storeID string, request *model.SellerProductSearchRequest) ([]entity.Product, int64, error) {
	var products []entity.Product

	query := db.Scopes(r.FilterSellerProduct(request)).
		Preload("Categories").
		Where("store_id = ?", storeID)
		
	switch request.Sort {
	case "price_desc":
		query = query.Order("price desc")
	case "price_asc":
		query = query.Order("price asc")
	default:
		query = query.Order("created_at desc")
	}

	err := query.
		Offset((request.Page - 1) * request.Size).
		Limit(request.Size).
		Find(&products).Error
	if err != nil {
		return nil, 0, err
	}

	var total int64
	err = db.Model(&entity.Product{}).Scopes(r.FilterSellerProduct(request)).Where("store_id = ?", storeID).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	return products, total, nil
}

func (r *ProductRepository) FindByStoreIDAndID(db *gorm.DB, product *entity.Product, storeID string, id string) error {
	return db.Preload("Categories").Where("store_id = ? AND id = ?", storeID, id).Take(product).Error
}

func (r *ProductRepository) FindByIDsForUpdate(db *gorm.DB, ids []string) ([]entity.Product, error) {
	var products []entity.Product
	err := db.Clauses(clause.Locking{Strength: "UPDATE"}).Where("id IN ?", ids).Find(&products).Error
	if err != nil {
		return nil, err
	}
	return products, nil
}
