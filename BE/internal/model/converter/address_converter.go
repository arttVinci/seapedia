package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func AddressToResponse(address *entity.Address) *model.AddressResponse {
	if address == nil {
		return nil
	}
	return &model.AddressResponse{
		ID:          address.ID,
		UserID:      address.UserID,
		Label:       address.Label,
		Recipient:   address.Recipient,
		Phone:       address.Phone,
		FullAddress: address.FullAddress,
	}
}

func AddressesToResponse(addresses []entity.Address) []model.AddressResponse {
	result := make([]model.AddressResponse, len(addresses))
	for i, a := range addresses {
		result[i] = *AddressToResponse(&a)
	}
	return result
}
