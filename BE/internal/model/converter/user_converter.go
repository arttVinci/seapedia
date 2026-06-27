package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func UserToResponse(user *entity.User) *model.UserResponse {
	return &model.UserResponse{
		ID:           user.ID,
		Username:     user.Username,
		Email:        user.Email,
		AuthProvider: user.AuthProvider,
		IsAdmin:      user.IsAdmin,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
	}
}

func UserToCurrentResponse(user *entity.User, activeRole string) *model.CurrentResponse {
	return &model.CurrentResponse{
		ID:           user.ID,
		Username:     user.Username,
		Email:        user.Email,
		AuthProvider: user.AuthProvider,
		IsAdmin:      user.IsAdmin,
		ActiveRole:   activeRole,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
	}
}
