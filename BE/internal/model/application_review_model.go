package model

type SearchApplicationReviewRequest struct {
	Page int `json:"page" validate:"min=1"`
	Size int `json:"size" validate:"min=1,max=100"`
}

type CreateApplicationReviewRequest struct {
	ReviewerName string `json:"reviewer_name" validate:"required,max=100"`
	Rating       int    `json:"rating" validate:"min=1,max=5"`
	Comment      string `json:"comment" validate:"omitempty,max=1000"`
}

type ApplicationReviewResponse struct {
	ID           string `json:"id"`
	ReviewerName string `json:"reviewer_name"`
	Rating       int    `json:"rating"`
	Comment      string `json:"comment"`
	CreatedAt    int64  `json:"created_at"`
}
