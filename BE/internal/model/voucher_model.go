package model

type CreateVoucherRequest struct {
	Code           string `json:"code" validate:"required,max=50"`
	DiscountAmount int64  `json:"discount_amount" validate:"required,min=1"`
	ExpiredAt      int64  `json:"expired_at" validate:"required,min=1"`
	RemainingUsage int    `json:"remaining_usage" validate:"required,min=1"`
}

type VoucherResponse struct {
	ID             string `json:"id"`
	Code           string `json:"code"`
	DiscountAmount int64  `json:"discount_amount"`
	ExpiredAt      int64  `json:"expired_at"`
	RemainingUsage int    `json:"remaining_usage"`
}
