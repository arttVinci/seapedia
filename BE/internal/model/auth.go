package model

import (
	"github.com/golang-jwt/jwt/v5"
)

// Auth merepresentasikan identitas pengguna yang sudah terautentikasi.
// Diisi oleh AuthMiddleware dan dibaca via GetUser(ctx) di handler/usecase.
type Auth struct {
	ID         string `json:"id"`
	Username   string `json:"username"`
	ActiveRole string `json:"active_role"`
	JTI        string `json:"jti"`
	Exp        int64  `json:"exp"`
}

// JWTCustomClaims adalah klaim JWT kustom SEAPEDIA yang berisi active_role dan jti
// selain klaim terdaftar standar (exp, iat).
type JWTCustomClaims struct {
	ID         string `json:"id"`
	Username   string `json:"username"`
	ActiveRole string `json:"active_role"`
	JTI        string `json:"jti"`
	jwt.RegisteredClaims
}
