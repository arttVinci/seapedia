package entity

type Store struct {
	ID          string `gorm:"column:id;primaryKey;type:varchar(36)"`
	UserID      string `gorm:"column:user_id;type:varchar(36);not null;uniqueIndex:idx_stores_user_id"`
	Name        string `gorm:"column:name;type:varchar(100);uniqueIndex:idx_stores_name;not null"`
	Description string `gorm:"column:description;type:text"`
	CreatedAt   int64  `gorm:"column:created_at;autoCreateTime:milli"`
	UpdatedAt   int64  `gorm:"column:updated_at;autoUpdateTime:milli"`
}

func (Store) TableName() string {
	return "stores"
}
