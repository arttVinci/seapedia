package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func OrderToResponse(order *entity.Order) model.OrderResponse {
	return model.OrderResponse{
		ID:             order.ID,
		StoreID:        order.StoreID,
		Status:         order.Status,
		DeliveryMethod: order.DeliveryMethod,
		Subtotal:       order.Subtotal,
		Discount:       order.Discount,
		DeliveryFee:    order.DeliveryFee,
		Tax:            order.Tax,
		FinalTotal:     order.FinalTotal,
		CreatedAt:      order.CreatedAt,
		UpdatedAt:      order.UpdatedAt,
	}
}

func OrdersToResponses(orders []entity.Order) []model.OrderResponse {
	responses := make([]model.OrderResponse, len(orders))
	for i, order := range orders {
		responses[i] = OrderToResponse(&order)
	}
	return responses
}

func OrderToDetailResponse(order *entity.Order) *model.OrderDetailResponse {
	items := make([]model.OrderItemResponse, len(order.Items))
	for i, item := range order.Items {
		items[i] = model.OrderItemResponse{
			ID:          item.ID,
			ProductID:   item.ProductID,
			ProductName: item.ProductName,
			Price:       item.Price,
			Quantity:    item.Quantity,
		}
	}

	histories := make([]model.OrderStatusHistoryResponse, len(order.StatusHistories))
	for i, h := range order.StatusHistories {
		histories[i] = model.OrderStatusHistoryResponse{
			ID:        h.ID,
			Status:    h.Status,
			Note:      h.Note,
			CreatedAt: h.CreatedAt,
		}
	}

	return &model.OrderDetailResponse{
		ID:             order.ID,
		StoreID:        order.StoreID,
		Status:         order.Status,
		DeliveryMethod: order.DeliveryMethod,
		Subtotal:       order.Subtotal,
		Discount:       order.Discount,
		DeliveryFee:    order.DeliveryFee,
		Tax:            order.Tax,
		FinalTotal:     order.FinalTotal,
		CreatedAt:      order.CreatedAt,
		UpdatedAt:      order.UpdatedAt,
		Items:          items,
		Histories:      histories,
	}
}