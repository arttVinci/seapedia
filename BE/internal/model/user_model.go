package model

type RegisterUserRequest struct {
	Username string `json:"username" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=6"`
	Role     string `json:"role" validate:"omitempty,oneof=buyer seller driver"`
}

type UserResponse struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	AuthProvider string `json:"auth_provider"`
	IsAdmin      bool   `json:"is_admin"`
	CreatedAt    int64  `json:"created_at"`
	UpdatedAt    int64  `json:"updated_at"`
}

type RegisterUserResponse struct {
	User UserResponse `json:"user"`
}

type LoginUserRequest struct {
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type LoginUserResponse struct {
	User  UserResponse `json:"user"`
	Token string       `json:"token"`
}

type LogoutUserResponse struct{}

type RolesResponse struct {
	Roles []string `json:"roles"`
}

type SelectRoleRequest struct {
	Role string `json:"role" validate:"required,oneof=buyer seller driver admin"`
}

type SelectRoleResponse struct {
	Token      string `json:"token"`
	ActiveRole string `json:"active_role"`
}

type CurrentResponse struct {
	ID           string `json:"id"`
	Username     string `json:"username"`
	Email        string `json:"email"`
	AuthProvider string `json:"auth_provider"`
	IsAdmin      bool   `json:"is_admin"`
	ActiveRole   string `json:"active_role"`
	CreatedAt    int64  `json:"created_at"`
	UpdatedAt    int64  `json:"updated_at"`
}
