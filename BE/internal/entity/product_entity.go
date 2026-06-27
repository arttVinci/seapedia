package entity

type Product struct {
	ID          string `gorm:"column:id;primaryKey;type:varchar(36)"`
	StoreID     string `gorm:"column:store_id;type:varchar(36);not null"`
	Name        string `gorm:"column:name;type:varchar(255);not null"`
	Description string `gorm:"column:description;type:text"`
	Price       int64  `gorm:"column:price;not null"`
	Stock       int    `gorm:"column:stock;not null;default:0"`
	ImageURL    string `gorm:"column:image_url;type:varchar(500)"`
	CreatedAt   int64  `gorm:"column:created_at;autoCreateTime:milli"`
	UpdatedAt   int64  `gorm:"column:updated_at;autoUpdateTime:milli"`

	Store *Store `gorm:"foreignKey:StoreID"`
}

func (Product) TableName() string {
	return "products"
}
