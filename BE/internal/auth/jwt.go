package auth

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"

	"github.com/traa/seapedia/server/internal/model"
)

// GenerateJWT menerbitkan access token JWT yang berisi klaim {id, username,
// active_role, jti, exp, iat}. Token ditandatangani dengan HMAC SHA256.
// expiredHours menentukan masa berlaku token dalam jam.
func GenerateJWT(secret, id, username, activeRole string, expiredHours int) (string, error) {
	now := time.Now()
	exp := now.Add(time.Duration(expiredHours) * time.Hour)

	claims := model.JWTCustomClaims{
		ID:         id,
		Username:   username,
		ActiveRole: activeRole,
		JTI:        uuid.NewString(),
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(exp),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ParseToken mem-parse dan memverifikasi signature token JWT. Mengembalikan
// klaim kustom (JWTCustomClaims) jika token valid. Error dikembalikan jika
// signature tidak valid atau token kedaluwarsa.
func ParseToken(secret, tokenString string) (*model.JWTCustomClaims, error) {
	claims := &model.JWTCustomClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, jwt.ErrTokenInvalidClaims
	}

	return claims, nil
}
