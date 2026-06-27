package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type UserRoleRepository struct {
	Repository[entity.UserRole]
	Log *logrus.Logger
}

func NewUserRoleRepository(log *logrus.Logger) *UserRoleRepository {
	return &UserRoleRepository{
		Log: log,
	}
}

func (r *UserRoleRepository) FindByUserID(db *gorm.DB, userRoles *[]entity.UserRole, userID string) error {
	return db.Where("user_id = ?", userID).Find(userRoles).Error
}
