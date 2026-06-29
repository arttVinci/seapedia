package entity

import "time"

type Cart struct {
	ID        string  `gorm:"primaryKey;column:id"`
	UserID    string  `gorm:"column:user_id"`
	StoreID   *string `gorm:"column:store_id"` // nullable
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt time.Time `gorm:"column:updated_at;autoUpdateTime"`

	// Relations (if needed)
	User      *User      `gorm:"foreignKey:UserID"`
	Store     *Store     `gorm:"foreignKey:StoreID"`
	CartItems []CartItem `gorm:"foreignKey:CartID"`
}

func (c *Cart) TableName() string {
	return "carts"
}
