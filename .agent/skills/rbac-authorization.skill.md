# Skill: Otorisasi Berbasis Peran Aktif

## Kapan dipakai
Setiap endpoint yang membutuhkan login dan/atau peran tertentu.

## Konsep
- Peran yang DIMILIKI disimpan di tabel user_roles.
- Peran AKTIF disimpan di klaim token JWT (active_role).
- Admin ditandai is_admin=true di tabel users (bukan lewat user_roles).

## Lapisan pemeriksaan (berlapis, wajib semua)
1. AuthMiddleware: validasi JWT, tolak jika jti ada di revoked_tokens (denylist).
   Ambil id + active_role ke Fiber Locals.
2. RoleMiddleware("seller"/"buyer"/"driver"): cek active_role cocok.
   Tidak cocok -> 403. Untuk rute admin: cek is_admin -> jika bukan, 403.
3. Pemeriksaan kepemilikan di usecase: pengguna hanya boleh menyentuh
   resource miliknya (mis. penjual hanya produk tokonya).

## Aturan wajib
- Otorisasi diverifikasi di SERVER, bukan hanya disembunyikan di UI.
- 401 = belum login / token tidak valid. 403 = login tetapi tidak berhak.
- Endpoint admin tidak boleh diakses non-admin.
- Pengguna tidak boleh mengakses/mengubah resource pengguna lain.

## Kesalahan yang harus dihindari
- JANGAN percaya peran dari body request atau header buatan klien.
- JANGAN hanya menyembunyikan tombol di UI tanpa cek server.
- JANGAN lupa cek kepemilikan walau peran sudah benar.
