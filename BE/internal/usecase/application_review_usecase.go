package usecase

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"

	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
)

type ApplicationReviewUseCase struct {
	DB               *gorm.DB
	Log              *logrus.Logger
	Validate         *validator.Validate
	ReviewRepository *repository.ApplicationReviewRepository
}

func NewApplicationReviewUseCase(db *gorm.DB, log *logrus.Logger, validate *validator.Validate, reviewRepo *repository.ApplicationReviewRepository) *ApplicationReviewUseCase {
	return &ApplicationReviewUseCase{DB: db, Log: log, Validate: validate, ReviewRepository: reviewRepo}
}

func (u *ApplicationReviewUseCase) Search(ctx context.Context, request *model.SearchApplicationReviewRequest) ([]model.ApplicationReviewResponse, int64, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, 0, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}
	db := u.DB.WithContext(ctx)
	reviews, total, err := u.ReviewRepository.Search(db, request)
	if err != nil {
		u.Log.Warnf("Failed to search reviews : %+v", err)
		return nil, 0, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan ulasan")
	}
	return converter.ApplicationReviewsToResponses(reviews), total, nil
}

func (u *ApplicationReviewUseCase) Create(ctx context.Context, request *model.CreateApplicationReviewRequest) (*model.ApplicationReviewResponse, error) {
	if err := u.Validate.Struct(request); err != nil {
		u.Log.Warnf("Invalid request body : %+v", err)
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}
	tx := u.DB.WithContext(ctx).Begin()
	defer tx.Rollback()

	review := &entity.ApplicationReview{
		ID:           uuid.NewString(),
		ReviewerName: request.ReviewerName,
		Rating:       request.Rating,
		Comment:      request.Comment,
	}
	if err := u.ReviewRepository.Create(tx, review); err != nil {
		u.Log.Warnf("Failed to create review : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat ulasan")
	}
	if err := tx.Commit().Error; err != nil {
		u.Log.Warnf("Failed commit transaction : %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat ulasan")
	}
	return converter.ApplicationReviewToResponse(review), nil
}
