package repository

import (
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type VoucherRepository struct {
	Repository[entity.Voucher]
	Log *logrus.Logger
}

func NewVoucherRepository(log *logrus.Logger) *VoucherRepository {
	return &VoucherRepository{Log: log}
}

func (r *VoucherRepository) FindByCode(db *gorm.DB, voucher *entity.Voucher, code string) error {
	return db.Where("code = ?", code).Take(voucher).Error
}

func (r *VoucherRepository) FindAll(db *gorm.DB) ([]entity.Voucher, error) {
	var vouchers []entity.Voucher
	err := db.Find(&vouchers).Error
	return vouchers, err
}
