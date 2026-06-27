package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"gorm.io/gorm"
)

type ApplicationReviewRepository struct {
	Repository[entity.ApplicationReview]
	Log *logrus.Logger
}

func NewApplicationReviewRepository(log *logrus.Logger) *ApplicationReviewRepository {
	return &ApplicationReviewRepository{Log: log}
}

func (r *ApplicationReviewRepository) Search(db *gorm.DB, request *model.SearchApplicationReviewRequest) ([]entity.ApplicationReview, int64, error) {
	var reviews []entity.ApplicationReview
	err := db.Offset((request.Page - 1) * request.Size).Limit(request.Size).Find(&reviews).Error
	if err != nil {
		return nil, 0, err
	}
	var total int64
	err = db.Model(&entity.ApplicationReview{}).Count(&total).Error
	if err != nil {
		return nil, 0, err
	}
	return reviews, total, nil
}
