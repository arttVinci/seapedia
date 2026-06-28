package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func StoreToResponse(store *entity.Store) *model.StoreResponse {
	if store == nil {
		return nil
	}
	return &model.StoreResponse{
		ID:          store.ID,
		UserID:      store.UserID,
		Name:        store.Name,
		Description: store.Description,
		CreatedAt:   store.CreatedAt,
		UpdatedAt:   store.UpdatedAt,
	}
}

func StoresToResponses(stores []entity.Store) []model.StoreResponse {
	var responses []model.StoreResponse
	for _, store := range stores {
		responses = append(responses, *StoreToResponse(&store))
	}
	if responses == nil {
		return []model.StoreResponse{}
	}
	return responses
}
