package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
)

type OrderItemRepository struct {
	Repository[entity.OrderItem]
	Log *logrus.Logger
}

func NewOrderItemRepository(log *logrus.Logger) *OrderItemRepository {
	return &OrderItemRepository{Log: log}
}