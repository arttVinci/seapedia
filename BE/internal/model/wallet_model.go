package model

type TopupRequest struct {
	Amount int `json:"amount" validate:"required,min=1"`
}

type WalletResponse struct {
	ID      string `json:"id"`
	UserID  string `json:"user_id"`
	Balance int    `json:"balance"`
}

type WalletTransactionResponse struct {
	ID          string `json:"id"`
	WalletID    string `json:"wallet_id"`
	Type        string `json:"type"`
	Amount      int    `json:"amount"`
	Description string `json:"description"`
	CreatedAt   int64  `json:"created_at"`
}

type WalletWithTransactionsResponse struct {
	ID           string                      `json:"id"`
	UserID       string                      `json:"user_id"`
	Balance      int                         `json:"balance"`
	Transactions []WalletTransactionResponse `json:"transactions"`
}
