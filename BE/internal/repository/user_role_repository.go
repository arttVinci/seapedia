package repository

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"

	"github.com/traa/seapedia/server/internal/entity"
)

// UserRoleRepository mengelola akses data entity.UserRole.
type UserRoleRepository struct {
	Log *logrus.Logger
}

// NewUserRoleRepository membuat instance UserRoleRepository baru.
func NewUserRoleRepository(log *logrus.Logger) *UserRoleRepository {
	return &UserRoleRepository{
		Log: log,
	}
}

// Create menyimpan role baru milik user ke tabel user_roles.
func (r *UserRoleRepository) Create(db *gorm.DB, userRole *entity.UserRole) error {
	return db.Create(userRole).Error
}

// FindByUserID mengambil seluruh role yang dimiliki user tertentu.
func (r *UserRoleRepository) FindByUserID(db *gorm.DB, userRoles *[]entity.UserRole, userID string) error {
	return db.Where("user_id = ?", userID).Find(userRoles).Error
}
