package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type WalletTransactionRepository struct {
	Repository[entity.WalletTransaction]
	Log *logrus.Logger
}

func NewWalletTransactionRepository(log *logrus.Logger) *WalletTransactionRepository {
	return &WalletTransactionRepository{
		Log: log,
	}
}

func (r *WalletTransactionRepository) FindByWalletID(db *gorm.DB, walletID string) ([]entity.WalletTransaction, error) {
	var transactions []entity.WalletTransaction
	err := db.Where("wallet_id = ?", walletID).Order("created_at desc").Find(&transactions).Error
	return transactions, err
}
