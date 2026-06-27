package auth

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/traa/seapedia/server/internal/model"
)

func GenerateJWT(secret string, id string, username string, activeRole string, expiredHours int) (string, error) {
	if expiredHours == 0 {
		expiredHours = 72
	}

	claims := model.JWTCustomClaims{
		ID:         id,
		Username:   username,
		ActiveRole: activeRole,
		RegisteredClaims: jwt.RegisteredClaims{
			ID:        uuid.NewString(),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(expiredHours) * time.Hour)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func ParseToken(secret string, tokenString string) (*model.JWTCustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &model.JWTCustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(secret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*model.JWTCustomClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}
