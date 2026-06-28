package entity

type Voucher struct {
	ID             string `gorm:"column:id;primaryKey;type:varchar(100)"`
	Code           string `gorm:"column:code;type:varchar(50);not null;uniqueIndex:idx_vouchers_code"`
	DiscountAmount int64  `gorm:"column:discount_amount;not null"`
	ExpiredAt      int64  `gorm:"column:expired_at;not null"`
	RemainingUsage int    `gorm:"column:remaining_usage;not null;default:0"`
}

func (Voucher) TableName() string {
	return "vouchers"
}
