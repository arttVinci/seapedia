package model

type CreateAddressRequest struct {
	Label       string `json:"label" validate:"required,max=50"`
	Recipient   string `json:"recipient" validate:"required,max=100"`
	Phone       string `json:"phone" validate:"required,max=20"`
	FullAddress string `json:"full_address" validate:"required,max=500"`
}

type UpdateAddressRequest struct {
	Label       string `json:"label" validate:"required,max=50"`
	Recipient   string `json:"recipient" validate:"required,max=100"`
	Phone       string `json:"phone" validate:"required,max=20"`
	FullAddress string `json:"full_address" validate:"required,max=500"`
}

type AddressResponse struct {
	ID          string `json:"id"`
	UserID      string `json:"user_id"`
	Label       string `json:"label"`
	Recipient   string `json:"recipient"`
	Phone       string `json:"phone"`
	FullAddress string `json:"full_address"`
}
