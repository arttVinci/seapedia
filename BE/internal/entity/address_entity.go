package entity

type Address struct {
	ID          string `gorm:"column:id;primaryKey;type:varchar(36)"`
	UserID      string `gorm:"column:user_id;type:varchar(36);not null;index:idx_addresses_user_id"`
	Label       string `gorm:"column:label;type:varchar(50)"`
	Recipient   string `gorm:"column:recipient;type:varchar(100)"`
	Phone       string `gorm:"column:phone;type:varchar(20)"`
	FullAddress string `gorm:"column:full_address;type:varchar(500)"`
}

func (Address) TableName() string {
	return "addresses"
}
