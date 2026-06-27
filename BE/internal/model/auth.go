package model

import "github.com/golang-jwt/jwt/v5"

type Auth struct {
	ID         string
	Username   string
	ActiveRole string
	JTI        string
	Exp        int64
}

type JWTCustomClaims struct {
	ID         string `json:"id"`
	Username   string `json:"username"`
	ActiveRole string `json:"active_role"`
	jwt.RegisteredClaims
}
