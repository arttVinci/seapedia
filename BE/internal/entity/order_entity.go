package entity

type Order struct {
	ID                  string `gorm:"column:id;primaryKey;type:varchar(36)"`
	BuyerID             string `gorm:"column:buyer_id;type:varchar(36);not null"`
	StoreID             string `gorm:"column:store_id;type:varchar(36);not null"`
	Status              string `gorm:"column:status;type:varchar(50);not null"`
	DeliveryMethod      string `gorm:"column:delivery_method;type:varchar(20);not null"`
	Subtotal            int64  `gorm:"column:subtotal;not null"`
	Discount            int64  `gorm:"column:discount;not null"`
	DeliveryFee         int64  `gorm:"column:delivery_fee;not null"`
	Tax                 int64  `gorm:"column:tax;not null"`
	FinalTotal          int64  `gorm:"column:final_total;not null"`
	VoucherID           *string `gorm:"column:voucher_id;type:varchar(36)"`
	PromoID             *string `gorm:"column:promo_id;type:varchar(36)"`
	AddressID           string `gorm:"column:address_id;type:varchar(36);not null"`
	CreatedSimulatedDay int    `gorm:"column:created_simulated_day;not null"`
	DueSimulatedDay     int    `gorm:"column:due_simulated_day;not null"`
	CreatedAt           int64  `gorm:"column:created_at;autoCreateTime:milli"`
	UpdatedAt           int64  `gorm:"column:updated_at;autoUpdateTime:milli"`

	Items           []OrderItem           `gorm:"foreignKey:OrderID"`
	StatusHistories []OrderStatusHistory  `gorm:"foreignKey:OrderID"`
}

func (Order) TableName() string {
	return "orders"
}