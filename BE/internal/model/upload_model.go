package model

import "mime/multipart"

type UploadImageRequest struct {
	ID     string                `json:"id"`
	UserID string                `json:"user_id"`
	Image  *multipart.FileHeader `json:"-"`
}
