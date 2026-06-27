package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

// UserToResponse mengkonversi entity.User menjadi model.UserResponse yang aman
// dikembalikan ke klien. Password tidak ikut dikonversi.
func UserToResponse(user *entity.User) *model.UserResponse {
	return &model.UserResponse{
		ID:           user.ID,
		Username:     user.Username,
		Email:        user.Email,
		AuthProvider: user.AuthProvider,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
	}
}
