package model

type AddCartItemRequest struct {
	ProductID string `json:"product_id" validate:"required"`
	Quantity  int    `json:"quantity" validate:"required,min=1"`
}

type UpdateCartItemRequest struct {
	Quantity int `json:"quantity" validate:"required,min=0"`
}

type CartResponse struct {
	ID        string             `json:"id"`
	StoreID   *string            `json:"store_id,omitempty"`
	StoreName *string            `json:"store_name,omitempty"`
	Items     []CartItemResponse `json:"items"`
}

type CartItemResponse struct {
	ID          string `json:"id"`
	ProductID   string `json:"product_id"`
	ProductName string `json:"product_name"`
	Price       int64  `json:"price"`
	Quantity    int    `json:"quantity"`
	Subtotal    int64  `json:"subtotal"`
	ImageURL    string `json:"image_url,omitempty"`
}
