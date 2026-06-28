package entity

type Promo struct {
	ID             string `gorm:"column:id;primaryKey;type:varchar(100)"`
	Code           string `gorm:"column:code;type:varchar(50);not null;uniqueIndex:idx_promos_code"`
	DiscountAmount int64  `gorm:"column:discount_amount;not null"`
	ExpiredAt      int64  `gorm:"column:expired_at;not null"`
}

func (Promo) TableName() string {
	return "promos"
}
