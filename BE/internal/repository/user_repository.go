package repository

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"

	"github.com/traa/seapedia/server/internal/entity"
)

// UserRepository mengelola akses data entity.User. Meng-embed Repository[T]
// agar mendapat operasi CRUD standar.
type UserRepository struct {
	Repository[entity.User]
	Log *logrus.Logger
}

// NewUserRepository membuat instance UserRepository baru.
func NewUserRepository(log *logrus.Logger) *UserRepository {
	return &UserRepository{
		Log: log,
	}
}

// FindByUsername mencari user berdasarkan username. Mengembalikan error
// gorm.ErrRecordNotFound jika tidak ditemukan.
func (r *UserRepository) FindByUsername(db *gorm.DB, user *entity.User, username string) error {
	return db.Where("username = ?", username).First(user).Error
}

// FindByEmail mencari user berdasarkan email. Mengembalikan error
// gorm.ErrRecordNotFound jika tidak ditemukan.
func (r *UserRepository) FindByEmail(db *gorm.DB, user *entity.User, email string) error {
	return db.Where("email = ?", email).First(user).Error
}
