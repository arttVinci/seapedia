package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type WalletRepository struct {
	Repository[entity.Wallet]
	Log *logrus.Logger
}

func NewWalletRepository(log *logrus.Logger) *WalletRepository {
	return &WalletRepository{
		Log: log,
	}
}

func (r *WalletRepository) FindByUserID(db *gorm.DB, wallet *entity.Wallet, userID string) error {
	return db.Where("user_id = ?", userID).Take(wallet).Error
}

func (r *WalletRepository) FindByUserIDForUpdate(db *gorm.DB, wallet *entity.Wallet, userID string) error {
	return db.Clauses(clause.Locking{Strength: "UPDATE"}).Where("user_id = ?", userID).Take(wallet).Error
}
