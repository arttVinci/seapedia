package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
)

type OrderStatusHistoryRepository struct {
	Repository[entity.OrderStatusHistory]
	Log *logrus.Logger
}

func NewOrderStatusHistoryRepository(log *logrus.Logger) *OrderStatusHistoryRepository {
	return &OrderStatusHistoryRepository{Log: log}
}