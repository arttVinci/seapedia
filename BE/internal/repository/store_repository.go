package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
)

type StoreRepository struct {
	Repository[entity.Store]
	Log *logrus.Logger
}

func NewStoreRepository(log *logrus.Logger) *StoreRepository {
	return &StoreRepository{Log: log}
}
