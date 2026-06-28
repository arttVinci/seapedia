package model

type CreatePromoRequest struct {
	Code           string `json:"code" validate:"required,max=50"`
	DiscountAmount int64  `json:"discount_amount" validate:"required,min=1"`
	ExpiredAt      int64  `json:"expired_at" validate:"required,min=1"`
}

type PromoResponse struct {
	ID             string `json:"id"`
	Code           string `json:"code"`
	DiscountAmount int64  `json:"discount_amount"`
	ExpiredAt      int64  `json:"expired_at"`
}
