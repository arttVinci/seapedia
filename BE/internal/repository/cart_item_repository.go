package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
)

type CartItemRepository struct {
	Repository[entity.CartItem]
	Log *logrus.Logger
}

func NewCartItemRepository(log *logrus.Logger) *CartItemRepository {
	return &CartItemRepository{
		Log: log,
	}
}
