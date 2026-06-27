package model

type SearchProductRequest struct {
	Name string `json:"name" validate:"omitempty,max=255"`
	Page int    `json:"page" validate:"min=1"`
	Size int    `json:"size" validate:"min=1,max=100"`
}

type ProductResponse struct {
	ID          string `json:"id"`
	StoreID     string `json:"store_id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int64  `json:"price"`
	Stock       int    `json:"stock"`
	ImageURL    string `json:"image_url"`
	CreatedAt   int64  `json:"created_at"`
	UpdatedAt   int64  `json:"updated_at"`
}

type ProductDetailResponse struct {
	ID          string         `json:"id"`
	StoreID     string         `json:"store_id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Price       int64          `json:"price"`
	Stock       int            `json:"stock"`
	ImageURL    string         `json:"image_url"`
	CreatedAt   int64          `json:"created_at"`
	UpdatedAt   int64          `json:"updated_at"`
	Store       *StoreResponse `json:"store"`
}
