package entity

type WalletTransaction struct {
	ID          string `gorm:"column:id;primaryKey;type:varchar(36)"`
	WalletID    string `gorm:"column:wallet_id;type:varchar(36);not null;index:idx_wallet_transactions_wallet_id"`
	Type        string `gorm:"column:type;type:varchar(20);not null"`
	Amount      int    `gorm:"column:amount;not null"`
	Description string `gorm:"column:description;type:varchar(500)"`
	CreatedAt   int64  `gorm:"column:created_at;autoCreateTime:milli"`
}

func (WalletTransaction) TableName() string {
	return "wallet_transactions"
}
