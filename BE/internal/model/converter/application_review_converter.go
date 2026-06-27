package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func ApplicationReviewToResponse(review *entity.ApplicationReview) *model.ApplicationReviewResponse {
	return &model.ApplicationReviewResponse{
		ID:           review.ID,
		ReviewerName: review.ReviewerName,
		Rating:       review.Rating,
		Comment:      review.Comment,
		CreatedAt:    review.CreatedAt,
	}
}

func ApplicationReviewsToResponses(reviews []entity.ApplicationReview) []model.ApplicationReviewResponse {
	responses := make([]model.ApplicationReviewResponse, len(reviews))
	for i, r := range reviews {
		responses[i] = *ApplicationReviewToResponse(&r)
	}
	return responses
}
