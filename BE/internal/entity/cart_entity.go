package entity

type Cart struct {
	ID        string  `gorm:"primaryKey;column:id"`
	UserID    string  `gorm:"column:user_id"`
	StoreID   *string `gorm:"column:store_id"` // nullable
	CreatedAt int64   `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt int64   `gorm:"column:updated_at;autoUpdateTime"`

	// Relations (if needed)
	User      *User      `gorm:"foreignKey:UserID"`
	Store     *Store     `gorm:"foreignKey:StoreID"`
	CartItems []CartItem `gorm:"foreignKey:CartID"`
}

func (c *Cart) TableName() string {
	return "carts"
}
