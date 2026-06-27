package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"gorm.io/gorm"

	"github.com/traa/seapedia/server/internal/auth"
	"github.com/traa/seapedia/server/internal/model"
	"github.com/traa/seapedia/server/internal/repository"
)

// AuthMiddleware adalah middleware yang memvalidasi access token JWT pada
// header Authorization. Middleware ini:
//  1. Mengekstrak token Bearer dari header.
//  2. Mem-parse dan memverifikasi signature token.
//  3. Mengecek apakah jti token ada di denylist (revoked_tokens); jika ada,
//     token ditolak walau belum kedaluwarsa.
//  4. Menyimpan identitas (model.Auth) ke Fiber Locals untuk dipakai handler.
//
// Catatan: AuthMiddleware T1-04 tidak menolak role kosong (active_role = "").
// Pemeriksaan role dilakukan oleh RoleMiddleware terpisah di T1-06.
func AuthMiddleware(viper *viper.Viper, db *gorm.DB, revokedTokenRepo *repository.RevokedTokenRepository, log *logrus.Logger) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		// Ekstrak header Authorization
		authorization := ctx.Get("Authorization")
		if authorization == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Token tidak ditemukan")
		}

		// Validasi format "Bearer <token>"
		parts := strings.Split(authorization, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return fiber.NewError(fiber.StatusUnauthorized, "Format token tidak valid")
		}

		tokenString := parts[1]

		// Parse dan verifikasi token
		claims, err := auth.ParseToken(viper.GetString("jwt.secret"), tokenString)
		if err != nil {
			log.Warnf("Failed to parse token : %+v", err)
			return fiber.NewError(fiber.StatusUnauthorized, "Token tidak valid atau kedaluwarsa")
		}

		// Cek denylist: apakah jti sudah di-revoke (logout)
		isRevoked, err := revokedTokenRepo.ExistsByJTI(db.WithContext(ctx.UserContext()), claims.JTI)
		if err != nil {
			log.Warnf("Failed to check denylist : %+v", err)
			return fiber.NewError(fiber.StatusInternalServerError, "Terjadi kesalahan")
		}
		if isRevoked {
			return fiber.NewError(fiber.StatusUnauthorized, "Token telah dicabut")
		}

		// Simpan identitas ke Fiber Locals untuk dipakai handler/usecase
		ctx.Locals("auth", &model.Auth{
			ID:         claims.ID,
			Username:   claims.Username,
			ActiveRole: claims.ActiveRole,
			JTI:        claims.JTI,
			Exp:        claims.ExpiresAt.Time.Unix(),
		})

		return ctx.Next()
	}
}

// GetUser mengambil identitas pengguna yang sudah terautentikasi dari Fiber
// Locals. Harus dipanggil setelah AuthMiddleware. Jika dipanggil tanpa
// AuthMiddleware, akan panic (by design: hanya untuk route terproteksi).
func GetUser(ctx *fiber.Ctx) *model.Auth {
	return ctx.Locals("auth").(*model.Auth)
}
