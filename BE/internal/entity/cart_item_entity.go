package entity

import "time"

type CartItem struct {
	ID        string `gorm:"primaryKey;column:id"`
	CartID    string `gorm:"column:cart_id"`
	ProductID string `gorm:"column:product_id"`
	Quantity  int    `gorm:"column:quantity"`
	CreatedAt time.Time  `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt time.Time  `gorm:"column:updated_at;autoUpdateTime"`

	// Relations
	Cart    *Cart    `gorm:"foreignKey:CartID"`
	Product *Product `gorm:"foreignKey:ProductID"`
}

func (c *CartItem) TableName() string {
	return "cart_items"
}
