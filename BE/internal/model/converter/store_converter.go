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
