package entity

type Delivery struct {
	ID          string  `gorm:"column:id;primaryKey;type:varchar(36)"`
	OrderID     string  `gorm:"column:order_id;type:varchar(36);not null;uniqueIndex"`
	DriverID    *string `gorm:"column:driver_id;type:varchar(36)"`
	Status      string  `gorm:"column:status;type:varchar(50);not null"`
	Earning     int64   `gorm:"column:earning;not null"`
	TakenAt     *int64  `gorm:"column:taken_at"`
	CompletedAt *int64  `gorm:"column:completed_at"`
	CreatedAt   int64   `gorm:"column:created_at;autoCreateTime:milli"`
	UpdatedAt   int64   `gorm:"column:updated_at;autoUpdateTime:milli"`
}

func (Delivery) TableName() string {
	return "deliveries"
}