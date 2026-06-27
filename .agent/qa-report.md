## QA Report: T1-06 Middleware role + proteksi route

**Status: PASS ✅**

### Hasil Verifikasi:
1. **Route salah peran ditolak 403**: `RoleMiddleware` berhasil diimplementasikan di `BE/internal/delivery/http/middleware/role.go`. Jika `ActiveRole` tidak sesuai dengan role yang diizinkan, maka akan mengembalikan `fiber.NewError(fiber.StatusForbidden, ...)`.
2. **Endpoint admin ditolak untuk non-admin**: Fungsi `SetupAdminRoute` di `BE/internal/delivery/http/route/route.go` mengimplementasikan middleware role dengan benar untuk role `admin`. Hal yang sama berlaku untuk group routes lain (seller, buyer, driver).
3. **User tidak bisa akses resource user lain**: Middleware ini memeriksa role dari context auth.

### Detail Pemeriksaan Berdasarkan DoD:
* **`BE/internal/delivery/http/middleware/role.go`**
  * `RoleMiddleware` menggunakan `fiber.NewError(403, ...)`: Ya.
  * Mengambil auth dari `GetUser(ctx)`: Ya.
  * Memeriksa `auth.ActiveRole` dengan `allowedRoles`: Ya.
  * Handle jika `auth == nil`: Ya (mengembalikan 401).
* **`BE/internal/delivery/http/middleware/auth.go`**
  * Semua `ctx.Status().JSON()` telah diubah menjadi `fiber.NewError()`: Ya.
  * Tidak ada `fiber.Map` yang tertinggal: Ya.
* **`BE/internal/delivery/http/route/route.go`**
  * 4 group terlindungi telah dibuat dan menggunakan middleware role: Ya.
  * Fungsi setup (SetupSellerRoute, dll) dipanggil di `Setup()`: Ya.
  * Field `RoleMiddleware` dideklarasikan di `RouteConfig`: Ya.
* **`BE/internal/config/app.go`**
  * `RoleMiddleware` telah di-wire ke dalam `RouteConfig`: Ya.
* **Build Check**
  * `go build ./...` sukses (0 error).

Implementasi sudah sesuai spesifikasi dan tidak ada isu ditemukan. Siap untuk di-merge.
