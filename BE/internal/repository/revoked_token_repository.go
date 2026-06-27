package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type RevokedTokenRepository struct {
	Repository[entity.RevokedToken]
	Log *logrus.Logger
}

func NewRevokedTokenRepository(log *logrus.Logger) *RevokedTokenRepository {
	return &RevokedTokenRepository{
		Log: log,
	}
}

func (r *RevokedTokenRepository) Create(db *gorm.DB, entity *entity.RevokedToken) error {
	return db.Clauses(clause.OnConflict{DoNothing: true}).Create(entity).Error
}

func (r *RevokedTokenRepository) ExistsByJTI(db *gorm.DB, jti string) (bool, error) {
	var count int64
	err := db.Model(&entity.RevokedToken{}).Where("jti = ?", jti).Count(&count).Error
	return count > 0, err
}
