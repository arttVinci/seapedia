package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func ProductToResponse(product *entity.Product) *model.ProductResponse {
	return &model.ProductResponse{
		ID:          product.ID,
		StoreID:     product.StoreID,
		Name:        product.Name,
		Description: product.Description,
		Price:       product.Price,
		Stock:       product.Stock,
		ImageURL:    product.ImageURL,
		CreatedAt:   product.CreatedAt,
		UpdatedAt:   product.UpdatedAt,
	}
}

func ProductToDetailResponse(product *entity.Product) *model.ProductDetailResponse {
	return &model.ProductDetailResponse{
		ID:          product.ID,
		StoreID:     product.StoreID,
		Name:        product.Name,
		Description: product.Description,
		Price:       product.Price,
		Stock:       product.Stock,
		ImageURL:    product.ImageURL,
		CreatedAt:   product.CreatedAt,
		UpdatedAt:   product.UpdatedAt,
		Store:       StoreToResponse(product.Store),
	}
}

func ProductsToResponses(products []entity.Product) []model.ProductResponse {
	responses := make([]model.ProductResponse, len(products))
	for i, p := range products {
		responses[i] = *ProductToResponse(&p)
	}
	return responses
}
