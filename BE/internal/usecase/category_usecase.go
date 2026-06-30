package usecase

import (
	"context"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type CategoryUseCase struct {
	DB                 *gorm.DB
	Log                *logrus.Logger
	CategoryRepository *repository.CategoryRepository
}

func NewCategoryUseCase(db *gorm.DB, log *logrus.Logger, categoryRepo *repository.CategoryRepository) *CategoryUseCase {
	return &CategoryUseCase{DB: db, Log: log, CategoryRepository: categoryRepo}
}

func (u *CategoryUseCase) GetAll(ctx context.Context) ([]string, error) {
	db := u.DB.WithContext(ctx)
	categories, err := u.CategoryRepository.GetAll(db)
	if err != nil {
		u.Log.Warnf("Failed to get categories: %+v", err)
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mendapatkan kategori")
	}

	var names []string
	for _, c := range categories {
		names = append(names, c.Name)
	}
	return names, nil
}
