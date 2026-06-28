package model

type StoreResponse struct {
	ID          string `json:"id"`
	UserID      string `json:"user_id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	CreatedAt   int64  `json:"created_at"`
	UpdatedAt   int64  `json:"updated_at"`
}

type CreateStoreRequest struct {
	Name        string `json:"name" validate:"required,max=100"`
	Description string `json:"description" validate:"max=1000"`
}

type UpdateStoreRequest struct {
	Name        string `json:"name" validate:"omitempty,max=100"`
	Description string `json:"description" validate:"omitempty,max=1000"`
}
