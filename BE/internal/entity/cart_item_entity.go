package entity

type CartItem struct {
	ID        string `gorm:"primaryKey;column:id"`
	CartID    string `gorm:"column:cart_id"`
	ProductID string `gorm:"column:product_id"`
	Quantity  int    `gorm:"column:quantity"`
	CreatedAt int64  `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt int64  `gorm:"column:updated_at;autoUpdateTime"`

	// Relations
	Cart    *Cart    `gorm:"foreignKey:CartID"`
	Product *Product `gorm:"foreignKey:ProductID"`
}

func (c *CartItem) TableName() string {
	return "cart_items"
}
