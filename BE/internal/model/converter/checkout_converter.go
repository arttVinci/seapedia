package converter

import "github.com/traa/seapedia/server/internal/model"

func CheckoutPreviewToResponse(subtotal, discount, taxable, tax, deliveryFee, finalTotal int64, voucherApplied *model.AppliedDiscountDetail, promoApplied *model.AppliedDiscountDetail) *model.CheckoutPreviewResponse {
	return &model.CheckoutPreviewResponse{
		Subtotal:       subtotal,
		Discount:       discount,
		Taxable:        taxable,
		Tax:            tax,
		DeliveryFee:    deliveryFee,
		FinalTotal:     finalTotal,
		VoucherApplied: voucherApplied,
		PromoApplied:   promoApplied,
	}
}