package usecase

import (
	"context"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/model/converter"
	"github.com/traa/seapedia/server/internal/repository"
	"gorm.io/gorm"
)

type WalletUseCase struct {
	DB                          *gorm.DB
	Log                         *logrus.Logger
	Validate                    *validator.Validate
	WalletRepository            *repository.WalletRepository
	WalletTransactionRepository *repository.WalletTransactionRepository
}

func NewWalletUseCase(
	db *gorm.DB,
	log *logrus.Logger,
	validate *validator.Validate,
	walletRepository *repository.WalletRepository,
	walletTransactionRepository *repository.WalletTransactionRepository,
) *WalletUseCase {
	return &WalletUseCase{
		DB:                          db,
		Log:                         log,
		Validate:                    validate,
		WalletRepository:            walletRepository,
		WalletTransactionRepository: walletTransactionRepository,
	}
}

func (c *WalletUseCase) GetWallet(ctx context.Context, userID string) (*model.WalletWithTransactionsResponse, error) {
	wallet := new(entity.Wallet)
	err := c.WalletRepository.FindByUserID(c.DB, wallet, userID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			// Jika dompet tidak ada, buat dummy respon saldo 0.
			return &model.WalletWithTransactionsResponse{
				ID:           "",
				UserID:       userID,
				Balance:      0,
				Transactions: []model.WalletTransactionResponse{},
			}, nil
		}
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mengambil data dompet")
	}

	transactions, err := c.WalletTransactionRepository.FindByWalletID(c.DB, wallet.ID)
	if err != nil {
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mengambil riwayat transaksi")
	}

	transactionResponses := make([]model.WalletTransactionResponse, len(transactions))
	for i, t := range transactions {
		transactionResponses[i] = *converter.WalletTransactionToResponse(&t)
	}

	return &model.WalletWithTransactionsResponse{
		ID:           wallet.ID,
		UserID:       wallet.UserID,
		Balance:      wallet.Balance,
		Transactions: transactionResponses,
	}, nil
}

func (c *WalletUseCase) Topup(ctx context.Context, userID string, request *model.TopupRequest) (*model.WalletResponse, error) {
	if err := c.Validate.Struct(request); err != nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	tx := c.DB.Begin()
	defer tx.Rollback()

	wallet := new(entity.Wallet)
	err := c.WalletRepository.FindByUserIDForUpdate(tx, wallet, userID)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			wallet = &entity.Wallet{
				ID:      uuid.NewString(),
				UserID:  userID,
				Balance: 0,
			}
			if err := c.WalletRepository.Create(tx, wallet); err != nil {
				c.Log.WithError(err).Error("failed to create wallet")
				return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal membuat dompet")
			}
		} else {
			c.Log.WithError(err).Error("failed to find wallet for update")
			return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mengakses dompet")
		}
	}

	wallet.Balance += request.Amount
	if err := c.WalletRepository.Update(tx, wallet); err != nil {
		c.Log.WithError(err).Error("failed to update wallet balance")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memperbarui saldo dompet")
	}

	transaction := &entity.WalletTransaction{
		ID:          uuid.NewString(),
		WalletID:    wallet.ID,
		Type:        "topup",
		Amount:      request.Amount,
		Description: "Top-up saldo (dummy)",
	}
	if err := c.WalletTransactionRepository.Create(tx, transaction); err != nil {
		c.Log.WithError(err).Error("failed to insert wallet transaction")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal mencatat transaksi")
	}

	if err := tx.Commit().Error; err != nil {
		c.Log.WithError(err).Error("failed to commit transaction")
		return nil, fiber.NewError(fiber.StatusInternalServerError, "Gagal memproses top-up")
	}

	return converter.WalletToResponse(wallet), nil
}
