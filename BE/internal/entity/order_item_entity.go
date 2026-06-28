package entity

type OrderItem struct {
	ID          string `gorm:"column:id;primaryKey;type:varchar(36)"`
	OrderID     string `gorm:"column:order_id;type:varchar(36);not null"`
	ProductID   string `gorm:"column:product_id;type:varchar(36);not null"`
	ProductName string `gorm:"column:product_name;type:varchar(100);not null"`
	Price       int64  `gorm:"column:price;not null"`
	Quantity    int    `gorm:"column:quantity;not null"`
	CreatedAt   int64  `gorm:"column:created_at;autoCreateTime:milli"`
	UpdatedAt   int64  `gorm:"column:updated_at;autoUpdateTime:milli"`
}

func (OrderItem) TableName() string {
	return "order_items"
}