package model

type OrderResponse struct {
	ID             string `json:"id"`
	StoreID        string `json:"store_id"`
	Status         string `json:"status"`
	DeliveryMethod string `json:"delivery_method"`
	Subtotal       int64  `json:"subtotal"`
	Discount       int64  `json:"discount"`
	DeliveryFee    int64  `json:"delivery_fee"`
	Tax            int64  `json:"tax"`
	FinalTotal     int64  `json:"final_total"`
	CreatedAt      int64  `json:"created_at"`
	UpdatedAt      int64  `json:"updated_at"`
}

type OrderDetailResponse struct {
	ID             string                       `json:"id"`
	StoreID        string                       `json:"store_id"`
	Status         string                       `json:"status"`
	DeliveryMethod string                       `json:"delivery_method"`
	Subtotal       int64                        `json:"subtotal"`
	Discount       int64                        `json:"discount"`
	DeliveryFee    int64                        `json:"delivery_fee"`
	Tax            int64                        `json:"tax"`
	FinalTotal     int64                        `json:"final_total"`
	CreatedAt      int64                        `json:"created_at"`
	UpdatedAt      int64                        `json:"updated_at"`
	Items          []OrderItemResponse          `json:"items"`
	Histories      []OrderStatusHistoryResponse `json:"status_histories"`
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