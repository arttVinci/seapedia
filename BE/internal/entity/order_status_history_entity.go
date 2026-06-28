package entity

type OrderStatusHistory struct {
	ID        string `gorm:"column:id;primaryKey;type:varchar(36)"`
	OrderID   string `gorm:"column:order_id;type:varchar(36);not null"`
	Status    string `gorm:"column:status;type:varchar(50);not null"`
	Note      string `gorm:"column:note;type:text"`
	CreatedAt int64  `gorm:"column:created_at;autoCreateTime:milli"`
}

func (OrderStatusHistory) TableName() string {
	return "order_status_histories"
}