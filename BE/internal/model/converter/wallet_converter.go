package converter

import (
	"github.com/traa/seapedia/server/internal/entity"
	"github.com/traa/seapedia/server/internal/model"
)

func WalletToResponse(wallet *entity.Wallet) *model.WalletResponse {
	if wallet == nil {
		return nil
	}
	return &model.WalletResponse{
		ID:      wallet.ID,
		UserID:  wallet.UserID,
		Balance: wallet.Balance,
	}
}

func WalletTransactionToResponse(transaction *entity.WalletTransaction) *model.WalletTransactionResponse {
	if transaction == nil {
		return nil
	}
	return &model.WalletTransactionResponse{
		ID:          transaction.ID,
		WalletID:    transaction.WalletID,
		Type:        transaction.Type,
		Amount:      transaction.Amount,
		Description: transaction.Description,
		CreatedAt:   transaction.CreatedAt,
	}
}
