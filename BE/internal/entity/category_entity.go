package entity

type Category struct {
	ID        string `gorm:"column:id;primaryKey;type:varchar(36)"`
	Name      string `gorm:"column:name;type:varchar(100);not null;unique"`
	CreatedAt int64  `gorm:"column:created_at;autoCreateTime:milli"`
	UpdatedAt int64  `gorm:"column:updated_at;autoUpdateTime:milli"`
}

func (Category) TableName() string {
	return "categories"
}
