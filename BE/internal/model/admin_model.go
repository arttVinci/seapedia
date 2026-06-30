package model

type DashboardStatsResponse struct {
	TotalUsers        int64 `json:"total_users"`
	TotalStores       int64 `json:"total_stores"`
	TotalProducts     int64 `json:"total_products"`
	TotalOrders       int64 `json:"total_orders"`
	TotalVouchers     int64 `json:"total_vouchers"`
	TotalPromos       int64 `json:"total_promos"`
	TotalDeliveryJobs int64 `json:"total_delivery_jobs"`
	OverdueOrders     int64 `json:"overdue_orders"`
	CurrentSimulatedDay int   `json:"current_simulated_day"`
}

type SimulateNextDayResponse struct {
	CurrentSimulatedDay int `json:"current_simulated_day"`
	ProcessedOverdue    int `json:"processed_overdue"`
}
