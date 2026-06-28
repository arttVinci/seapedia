package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func CartToResponse(cart *entity.Cart) *model.CartResponse {
	if cart == nil {
		return nil
	}

	response := &model.CartResponse{
		ID:      cart.ID,
		StoreID: cart.StoreID,
		Items:   make([]model.CartItemResponse, 0),
	}

	if cart.Store != nil {
		storeName := cart.Store.Name
		response.StoreName = &storeName
	}

	if cart.CartItems != nil {
		for _, item := range cart.CartItems {
			response.Items = append(response.Items, *CartItemToResponse(&item))
		}
	}

	return response
}

func CartItemToResponse(item *entity.CartItem) *model.CartItemResponse {
	if item == nil {
		return nil
	}

	response := &model.CartItemResponse{
		ID:        item.ID,
		ProductID: item.ProductID,
		Quantity:  item.Quantity,
	}

	if item.Product != nil {
		response.ProductName = item.Product.Name
		response.Price = item.Product.Price
		response.Subtotal = item.Product.Price * int64(item.Quantity)
		response.ImageURL = item.Product.ImageURL
	}

	return response
}
