package repository

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"github.com/traa/seapedia/server/internal/entity"
)

// RevokedTokenRepository mengelola akses data entity.RevokedToken (denylist).
type RevokedTokenRepository struct {
	Log *logrus.Logger
}

// NewRevokedTokenRepository membuat instance RevokedTokenRepository baru.
func NewRevokedTokenRepository(log *logrus.Logger) *RevokedTokenRepository {
	return &RevokedTokenRepository{
		Log: log,
	}
}

// Create memasukkan token yang dicabut ke tabel revoked_tokens. Operasi ini
// idempotent: jika jti sudah ada, tidak error (OnConflict DoNothing).
func (r *RevokedTokenRepository) Create(db *gorm.DB, revokedToken *entity.RevokedToken) error {
	return db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "jti"}},
		DoNothing: true,
	}).Create(revokedToken).Error
}

// ExistsByJTI mengecek apakah jti tertentu sudah ada di denylist.
// Mengembalikan true jika token sudah dicabut (revoked).
func (r *RevokedTokenRepository) ExistsByJTI(db *gorm.DB, jti string) (bool, error) {
	var count int64
	err := db.Model(&entity.RevokedToken{}).Where("jti = ?", jti).Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
