package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func VoucherToResponse(voucher *entity.Voucher) *model.VoucherResponse {
	return &model.VoucherResponse{
		ID:             voucher.ID,
		Code:           voucher.Code,
		DiscountAmount: voucher.DiscountAmount,
		ExpiredAt:      voucher.ExpiredAt,
		RemainingUsage: voucher.RemainingUsage,
	}
}

func VouchersToResponses(vouchers []entity.Voucher) []model.VoucherResponse {
	responses := make([]model.VoucherResponse, len(vouchers))
	for i, v := range vouchers {
		responses[i] = *VoucherToResponse(&v)
	}
	return responses
}
