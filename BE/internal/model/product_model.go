package model

type SearchProductRequest struct {
	Name     string   `json:"name" validate:"omitempty,max=255"`
	Category []string `json:"category" validate:"omitempty"` // Filter by categories
	Page     int      `json:"page" validate:"min=1"`
	Size     int      `json:"size" validate:"min=1,max=100"`
	Sort     string   `json:"sort" validate:"omitempty"`
}

type ProductResponse struct {
	ID          string   `json:"id"`
	StoreID     string   `json:"store_id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Price       int64    `json:"price"`
	Stock       int      `json:"stock"`
	ImageURL    string   `json:"image_url"`
	Categories  []string `json:"categories,omitempty"`
	CreatedAt   int64    `json:"created_at"`
	UpdatedAt   int64    `json:"updated_at"`
}

type ProductDetailResponse struct {
	ID          string         `json:"id"`
	StoreID     string         `json:"store_id"`
	Store       *StoreResponse `json:"store"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Price       int64          `json:"price"`
	Stock       int            `json:"stock"`
	ImageURL    string         `json:"image_url"`
	Categories  []string       `json:"categories,omitempty"`
	CreatedAt   int64          `json:"created_at"`
	UpdatedAt   int64          `json:"updated_at"`
}

type CreateProductRequest struct {
	Name        string   `json:"name" validate:"required,max=100"`
	Description string   `json:"description" validate:"max=2000"`
	Price       int64    `json:"price" validate:"required,min=1"`
	Stock       int      `json:"stock" validate:"required,min=0"`
	ImageURL    string   `json:"image_url" validate:"omitempty,url"`
	Categories  []string `json:"categories" validate:"omitempty"`
}

type UpdateProductRequest struct {
	Name        string   `json:"name" validate:"omitempty,max=100"`
	Description string   `json:"description" validate:"omitempty,max=2000"`
	Price       int64    `json:"price" validate:"omitempty,min=1"`
	Stock       int      `json:"stock" validate:"omitempty,min=0"`
	ImageURL    string   `json:"image_url" validate:"omitempty,url"`
	Categories  []string `json:"categories" validate:"omitempty"`
}

type SellerProductSearchRequest struct {
	Name     string   `json:"name"`
	Category []string `json:"category" validate:"omitempty"`
	Page     int      `json:"page" validate:"required,min=1"`
	Size     int      `json:"size" validate:"required,min=1,max=100"`
	Sort     string   `json:"sort" validate:"omitempty"`
}
