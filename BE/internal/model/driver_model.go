package model

type ListJobsRequest struct {
	// Request params kalau ada (nanti bisa dipakai buat pagination)
}

// JobResponse merepresentasikan pesanan yang bisa diambil (atau sudah diambil) oleh driver
type JobResponse struct {
	OrderID         string  `json:"order_id"`
	StoreID         string  `json:"store_id"`
	Status          string  `json:"status"`
	DeliveryMethod  string  `json:"delivery_method"`
	DeliveryFee     int64   `json:"delivery_fee"`
	AddressID       string  `json:"address_id"`
	CreatedAt       int64   `json:"created_at"`
}
