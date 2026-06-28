package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
)

type DeliveryRepository struct {
	Repository[entity.Delivery]
	Log *logrus.Logger
}

func NewDeliveryRepository(log *logrus.Logger) *DeliveryRepository {
	return &DeliveryRepository{Log: log}
}