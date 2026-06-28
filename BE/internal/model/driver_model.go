package model

type ListJobsRequest struct {
	// Request params kalau ada (nanti bisa dipakai buat pagination)
}

// JobResponse merepresentasikan pesanan yang bisa diambil (atau sudah diambil) oleh driver
type JobResponse struct {
	OrderID         string  `json:"order_id"`
	StoreID         string  `json:"store_id"`
	StoreName       string  `json:"store_name"`
	Status          string  `json:"status"`
	DeliveryMethod  string  `json:"delivery_method"`
	DeliveryFee     int64   `json:"delivery_fee"`
	AddressID       string  `json:"address_id"`
	CreatedAt       int64   `json:"created_at"`
}

type TakeJobResponse struct {
	Success bool `json:"success"`
}

type CompleteJobResponse struct {
	Success    bool  `json:"success"`
	DriverEarning int64 `json:"driver_earning"`
}

type DashboardResponse struct {
	ActiveJob      *DashboardActiveJob  `json:"active_job"`
	CompletedToday int                  `json:"completed_today"`
	TotalEarning   int64                `json:"total_earning"`
	RecentJobs     []RecentJobResponse  `json:"recent_jobs"`
}

type DashboardActiveJob struct {
	OrderID        string `json:"order_id"`
	StoreID        string `json:"store_id"`
	DeliveryMethod string `json:"delivery_method"`
	DeliveryFee    int64  `json:"delivery_fee"`
	TakenAt        *int64 `json:"taken_at"`
}

type RecentJobResponse struct {
	OrderID       string `json:"order_id"`
	Status        string `json:"status"`
	DeliveryFee   int64  `json:"delivery_fee"`
	DriverEarning int64  `json:"driver_earning"`
	CompletedAt   *int64 `json:"completed_at"`
}
