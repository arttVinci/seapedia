package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func OrderToJobResponse(order *entity.Order) model.JobResponse {
	storeName := ""
	if order.Store != nil {
		storeName = order.Store.Name
	}
	return model.JobResponse{
		OrderID:        order.ID,
		StoreID:        order.StoreID,
		StoreName:      storeName,
		Status:         order.Status,
		DeliveryMethod: order.DeliveryMethod,
		DeliveryFee:    order.DeliveryFee,
		AddressID:      order.AddressID,
		CreatedAt:      order.CreatedAt,
	}
}

func OrdersToJobResponses(orders []entity.Order) []model.JobResponse {
	var responses []model.JobResponse
	for _, order := range orders {
		responses = append(responses, OrderToJobResponse(&order))
	}
	if len(responses) == 0 {
		return []model.JobResponse{}
	}
	return responses
}
