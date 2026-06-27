package model

// RegisterUserRequest adalah payload pendaftaran pengguna baru.
// Role opsional (buyer/seller/driver); default buyer bila kosong.
type RegisterUserRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	Role     string `json:"role" validate:"omitempty,oneof=buyer seller driver"`
}

// RegisterUserResponse adalah hasil pendaftaran pengguna.
type RegisterUserResponse struct {
	User UserResponse `json:"user"`
}

// LoginUserRequest adalah payload login pengguna.
type LoginUserRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

// LoginUserResponse adalah hasil login; berisi data user dan access token.
type LoginUserResponse struct {
	User  UserResponse `json:"user"`
	Token string       `json:"token"`
}

// LogoutUserResponse adalah hasil logout; kosong karena hanya menandakan sukses.
type LogoutUserResponse struct {
}

// UserResponse adalah representasi user yang aman dikembalikan ke klien.
type UserResponse struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	AuthProvider string `json:"auth_provider"`
	CreatedAt    int64  `json:"created_at"`
	UpdatedAt    int64  `json:"updated_at"`
}
