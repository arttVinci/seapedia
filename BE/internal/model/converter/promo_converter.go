package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func PromoToResponse(promo *entity.Promo) *model.PromoResponse {
	return &model.PromoResponse{
		ID:             promo.ID,
		Code:           promo.Code,
		DiscountAmount: promo.DiscountAmount,
		ExpiredAt:      promo.ExpiredAt,
	}
}

func PromosToResponses(promos []entity.Promo) []model.PromoResponse {
	responses := make([]model.PromoResponse, len(promos))
	for i, p := range promos {
		responses[i] = *PromoToResponse(&p)
	}
	return responses
}
