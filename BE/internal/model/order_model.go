package model

type OrderResponse struct {
	ID                  string  `json:"id"`
	BuyerID             string  `json:"buyer_id"`
	StoreID             string  `json:"store_id"`
	Status              string  `json:"status"`
	DeliveryMethod      string  `json:"delivery_method"`
	Subtotal            int64   `json:"subtotal"`
	Discount            int64   `json:"discount"`
	DeliveryFee         int64   `json:"delivery_fee"`
	Tax                 int64   `json:"tax"`
	FinalTotal          int64   `json:"final_total"`
	VoucherID           *string `json:"voucher_id"`
	PromoID             *string `json:"promo_id"`
	AddressID           string  `json:"address_id"`
	CreatedSimulatedDay int     `json:"created_simulated_day"`
	DueSimulatedDay     int     `json:"due_simulated_day"`
	CreatedAt           int64   `json:"created_at"`
	UpdatedAt           int64   `json:"updated_at"`
}

type OrderDetailResponse struct {
	ID                  string                       `json:"id"`
	OrderID             string                       `json:"order_id"`
	BuyerID             string                       `json:"buyer_id"`
	StoreID             string                       `json:"store_id"`
	StoreName           string                       `json:"store_name"`
	Status              string                       `json:"status"`
	DeliveryMethod      string                       `json:"delivery_method"`
	Subtotal            int64                        `json:"subtotal"`
	Discount            int64                        `json:"discount"`
	DeliveryFee         int64                        `json:"delivery_fee"`
	Tax                 int64                        `json:"tax"`
	FinalTotal          int64                        `json:"final_total"`
	VoucherID           *string                      `json:"voucher_id"`
	PromoID             *string                      `json:"promo_id"`
	AddressID           string                       `json:"address_id"`
	CreatedSimulatedDay int                          `json:"created_simulated_day"`
	DueSimulatedDay     int                          `json:"due_simulated_day"`
	CreatedAt           int64                        `json:"created_at"`
	UpdatedAt           int64                        `json:"updated_at"`
	Items               []OrderItemResponse          `json:"items"`
	Histories           []OrderStatusHistoryResponse `json:"status_histories"`
}

type OrderItemResponse struct {
	ID          string `json:"id"`
	ProductID   string `json:"product_id"`
	ProductName string `json:"product_name"`
	Price       int64  `json:"price"`
	Quantity    int    `json:"quantity"`
}

type OrderStatusHistoryResponse struct {
	ID        string `json:"id"`
	Status    string `json:"status"`
	Note      string `json:"note"`
	CreatedAt int64  `json:"created_at"`
}