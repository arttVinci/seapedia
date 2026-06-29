package storage

import (
	"context"
	"mime/multipart"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryStorage struct {
	Client *cloudinary.Cloudinary
}

func NewCloudinaryStorage(client *cloudinary.Cloudinary) *CloudinaryStorage {
	return &CloudinaryStorage{Client: client}
}

func (s *CloudinaryStorage) Upload(ctx context.Context, file *multipart.FileHeader, folder string) (string, error) {
	response, err := s.Client.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: folder,
	})
	if err != nil {
		return "", err
	}
	return response.SecureURL, nil
}

func (s *CloudinaryStorage) Delete(ctx context.Context, publicID string) error {
	_, err := s.Client.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicID,
	})
	return err
}
