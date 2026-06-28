package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type OrderRepository struct {
	Repository[entity.Order]
	Log *logrus.Logger
}

func NewOrderRepository(log *logrus.Logger) *OrderRepository {
	return &OrderRepository{Log: log}
}

func (r *OrderRepository) ListByBuyer(db *gorm.DB, buyerID string) ([]entity.Order, error) {
	var orders []entity.Order
	err := db.Where("buyer_id = ?", buyerID).Order("created_at desc").Find(&orders).Error
	if err != nil {
		return nil, err
	}
	return orders, nil
}

func (r *OrderRepository) FindByBuyerAndID(db *gorm.DB, buyerID string, orderID string) (*entity.Order, error) {
	var order entity.Order
	err := db.Preload("Items").Preload("StatusHistories").Where("buyer_id = ? AND id = ?", buyerID, orderID).Take(&order).Error
	if err != nil {
		return nil, err
	}
	return &order, nil
}