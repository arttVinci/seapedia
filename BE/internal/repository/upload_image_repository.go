package repository

import (
	"context"
	"mime/multipart"

	"github.com/sirupsen/logrus"

	"github.com/traa/seapedia/server/internal/pkg/storage"
)

type UploadImageRepository struct {
	Storage *storage.CloudinaryStorage
	Log     *logrus.Logger
}

func NewUploadImageRepository(s *storage.CloudinaryStorage, log *logrus.Logger) *UploadImageRepository {
	return &UploadImageRepository{Storage: s, Log: log}
}

func (r *UploadImageRepository) UploadImage(ctx context.Context, file *multipart.FileHeader, folder string) (string, error) {
	url, err := r.Storage.Upload(ctx, file, folder)
	if err != nil {
		r.Log.WithError(err).Error("error uploading image to cloudinary")
		return "", err
	}
	return url, nil
}

func (r *UploadImageRepository) DeleteImage(ctx context.Context, publicId string) error {
	if err := r.Storage.Delete(ctx, publicId); err != nil {
		r.Log.WithError(err).Warn("failed to delete old image, continuing upload")
		return err
	}

	return nil
}
