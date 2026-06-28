package model

type CheckoutPreviewRequest struct {
	DeliveryMethod string `json:"delivery_method" validate:"required,oneof=instant next_day regular"`
	AddressID      string `json:"address_id" validate:"required"`
	VoucherCode    string `json:"voucher_code"`
	PromoCode      string `json:"promo_code"`
}

type CheckoutPreviewResponse struct {
	Subtotal       int64                  `json:"subtotal"`
	Discount       int64                  `json:"discount"`
	Taxable        int64                  `json:"taxable"`
	Tax            int64                  `json:"tax"`
	DeliveryFee    int64                  `json:"delivery_fee"`
	FinalTotal     int64                  `json:"final_total"`
	VoucherApplied *AppliedDiscountDetail `json:"voucher_applied,omitempty"`
	PromoApplied   *AppliedDiscountDetail `json:"promo_applied,omitempty"`
}

type AppliedDiscountDetail struct {
	Code   string `json:"code"`
	Amount int64  `json:"amount"`
}