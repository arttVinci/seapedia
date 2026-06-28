package entity

type Wallet struct {
	ID      string `gorm:"column:id;primaryKey;type:varchar(36)"`
	UserID  string `gorm:"column:user_id;type:varchar(36);not null;uniqueIndex:idx_wallets_user_id"`
	Balance int    `gorm:"column:balance;not null;default:0"`
}

func (Wallet) TableName() string {
	return "wallets"
}
