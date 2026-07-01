# Software Design Document (SDD) - SEAPEDIA Marketplace

> Dokumen turunan dari Product Requirement Document (PRD) versi 1.0 dan System Map.
> Tujuan: mendefinisikan desain teknis sistem secara detail (keputusan teknis,
> struktur kode, struktur database, kontrak API, mesin status pesanan, dan
> desain modul kritis) sebagai acuan implementasi.
>
> Jika terjadi konflik, Product Requirement Document tetap menjadi sumber
> kebenaran utama untuk kebutuhan; dokumen ini menjadi sumber kebenaran untuk
> keputusan teknis.

---

## Daftar Istilah Teknis

- ERD (Entity Relationship Diagram): diagram tabel database dan hubungannya.
- Middleware: "penjaga pintu" yang dijalankan sebelum permintaan masuk ke
  handler utama.
- 401: status HTTP "belum login / identitas tidak valid".
- 403: status HTTP "sudah login, tetapi tidak punya hak untuk aksi ini".
- Denylist (blacklist): daftar hal yang dilarang/ditolak. Di sini: daftar token
  yang sudah logout sehingga ditolak walau belum kedaluwarsa.
- jti (JWT ID): penanda unik tiap token.
- Transaksi (database): sekelompok operasi yang dianggap satu kesatuan; semua
  berhasil bersama (commit) atau semua dibatalkan bersama (rollback).
- Commit: menyimpan permanen perubahan transaksi.
- Rollback: membatalkan seluruh perubahan transaksi.
- Konkurensi: beberapa hal terjadi bersamaan.
- Row-level locking (SELECT FOR UPDATE): mengunci baris saat dibaca dalam
  transaksi, sehingga transaksi lain yang ingin mengubah baris sama harus
  menunggu.
- Atomic: operasi yang terjadi "sekali jadi", tidak bisa terpotong di tengah.
- Conditional update: pembaruan yang hanya berjalan jika syarat tertentu masih
  terpenuhi.
- Rows affected: jumlah baris yang benar-benar berubah oleh sebuah perintah.
- Idempotent: operasi yang jika dijalankan berkali-kali hasilnya tetap sama
  seperti dijalankan sekali.
- Snapshot: "potret" data pada saat itu yang disimpan terpisah, agar perubahan
  data asli kemudian hari tidak mengubah catatan lama.
- Terminal state: keadaan akhir yang tidak punya jalan keluar.
- Reversal: membalik/membatalkan pencatatan keuangan yang sudah terjadi.

---

## Bagian 1: Keputusan Teknis

Tujuh keputusan ini menjadi fondasi seluruh desain. Sebagian berasal dari Open
Issue pada Product Requirement Document, sebagian dari celah arsitektur basis
kode lama.

### Keputusan 1: Penyimpanan Peran Aktif
- Masalah: satu pengguna bisa punya banyak peran; sesi harus tahu sedang
  memakai peran yang mana.
- Keputusan: peran aktif disimpan di dalam klaim token JWT. Token berisi
  `{ id, username, active_role, exp, iat, jti }`. Mengganti peran berarti
  menerbitkan token baru.
- Alasan: konsisten dengan arsitektur JWT yang sudah ada; server tetap stateless;
  paling sederhana untuk didemokan.

### Keputusan 2: Pembatalan Token saat Logout
- Masalah: Product Requirement Document mewajibkan logout benar-benar
  membatalkan token; JWT secara alami tidak bisa ditarik sebelum kedaluwarsa.
- Keputusan: JWT + tabel daftar token dicabut (`revoked_tokens`). Saat logout,
  klaim `jti` token dimasukkan ke tabel ini. Middleware menolak token yang ada
  di daftar.
- Alasan: tetap memakai JWT tanpa merombak total, sekaligus memenuhi kewajiban
  pembatalan. Tabel dapat dibersihkan berkala (hapus yang sudah kedaluwarsa).

### Keputusan 3: Otorisasi Berbasis Peran Aktif
- Masalah: basis kode lama hanya memiliki autentikasi dan pemeriksaan
  kepemilikan; belum ada otorisasi peran.
- Keputusan: tambahkan middleware peran, berlapis:
  1. AuthMiddleware (sudah ada): validasi token, ambil `id` + `active_role`,
     cek `jti` tidak ada di denylist.
  2. RoleMiddleware (baru): cek `active_role` sesuai yang dibutuhkan rute;
     jika tidak cocok tolak dengan 403.
  3. Pemeriksaan kepemilikan tetap di lapisan usecase.
- Alasan: berlapis dan jelas. Peran dicek di pintu masuk, kepemilikan dicek di
  logika bisnis.

### Keputusan 4: Keamanan Stok saat Checkout Bersamaan
- Masalah: dua pembeli checkout produk sama bersamaan dapat membuat stok negatif.
- Keputusan: gunakan row-level locking (SELECT ... FOR UPDATE via GORM
  clause.Locking) di dalam transaksi. Baris produk dikunci, stok dibaca,
  divalidasi cukup, dikurangi, lalu commit.
- Alasan: cara paling aman dan langsung memenuhi syarat "stok tidak boleh
  negatif".

### Keputusan 5: Satu Pengemudi per Pesanan (Tanpa Pengambilan Ganda)
- Masalah: dua pengemudi menekan "ambil pekerjaan" bersamaan dapat membuat
  keduanya mendapatkan pekerjaan.
- Keputusan: gunakan atomic conditional update. Ubah pesanan menjadi
  "Sedang Dikirim" dan isi id pengemudi hanya jika status masih "Menunggu
  Pengirim" dan belum ada pengemudi. Jika rows affected = 1 berhasil; jika 0
  sudah diambil orang lain.
- Alasan: lebih ringan daripada penguncian penuh dan sangat cocok untuk kasus
  rebutan satu pekerjaan.

### Keputusan 6: Granularitas Waktu Batas Pengiriman Instant
- Masalah: simulasi waktu berbasis hari; Instant idealnya berbasis jam.
- Keputusan: Instant jatuh tempo pada hari simulasi yang sama. Jika saat hari
  dimajukan pesanan Instant belum selesai, langsung terlambat. (Instant = 0
  hari, Next Day = 1 hari, Regular = 3 hari.)
- Alasan: konsisten dengan mekanisme "Majukan Hari" tanpa menambah kerumitan
  simulasi per jam.

### Keputusan 7: Titik Pencatatan Pendapatan Penjual
- Masalah: kapan pendapatan penjual dianggap tercatat memengaruhi kebutuhan
  pembalikan saat pengembalian dana.
- Keputusan: pendapatan penjual dicatat saat pesanan mencapai "Pesanan Selesai".
  Karena keterlambatan terjadi sebelum selesai, pembalikan umumnya tidak
  diperlukan; namun mekanisme pembalikan tetap disediakan.
- Alasan: mengurangi kebutuhan pembalikan sekaligus tetap memenuhi aturan.

---

## Bagian 2: Struktur Folder & Konvensi

Adaptasi dari basis kode lama yang sudah terbukti jalan, dengan membuang
AI/Gemini, template portfolio, verifikasi OTP, dan OAuth Google.

### Struktur Backend

BE/
├── cmd/main.go                  # Entrypoint
├── config.json                  # Konfigurasi (Viper)
├── db/migrations/               # File SQL migration manual (up/down)
└── internal/
    ├── auth/                    # Helper JWT (generate + parse klaim active_role)
    ├── config/                  # Inisialisasi Fiber, GORM, Viper, Logrus
    ├── delivery/http/
    │   ├── controller/          # HTTP handler per modul
    │   ├── middleware/
    │   │   ├── auth.go          # Validasi JWT + cek denylist
    │   │   └── role.go          # (BARU) cek active_role
    │   └── route/               # Registrasi rute (guest, public, auth)
    ├── entity/                  # Struct GORM (skema database)
    ├── model/                   # Model request/response + converter
    │   └── converter/
    ├── pkg/
    │   ├── storage/             # Cloudinary (jika produk memakai gambar)
    │   └── utils/               # Helper (generate id, dll)
    ├── repository/              # Lapisan akses data (+ Repository[T] generik)
    └── usecase/                 # Lapisan logika bisnis


### Struktur Frontend

FE/src/
├── api/                  # Axios client + error wrapper
├── config/              # Base URL, storage key
├── hooks/
│   ├── mutations/       # TanStack Mutation per modul
│   └── queries/         # TanStack Query per modul
├── layouts/             # AuthLayout, DashboardLayout, HomeLayout
├── pages/               # Halaman per modul & per peran
├── sections/            # Komponen bagian halaman
├── services/            # Service class per modul (singleton)
├── components/          # Komponen UI reusable (Button, Input, Card, dll)
└── utils/


### Konvensi yang Dikunci (dasar .skills/)

- Format respons sukses: WebResponse[T] (`{ data, message, success, paging }`).
- Format respons error: ApiErrorResponse (`{ message, statusCode, errors }`).
- Error dilempar dengan `fiber.NewError(kode, pesan)`, ditangkap ErrorHandler
  global.
- Transaksi: tiap usecase yang menulis data membuka transaksi GORM
  (Begin -> defer Rollback -> Commit).
- Penamaan file per modul: `{modul}_entity.go`, `{modul}_model.go`,
  `{modul}_repository.go`, `{modul}_usecase.go`, `{modul}_controller.go`,
  `{modul}_converter.go`.
- Penamaan endpoint aksi memakai awalan garis bawah (mengikuti pola lama):
  contoh `_login`, `_topup`, `_take`.

---

## Bagian 3: Desain Database (ERD)

### Diagram Relasi Tingkat Tinggi

users ──< user_roles                         (1 pengguna : banyak peran)
users ──1 wallets ──< wallet_transactions    (1 pembeli : 1 dompet : banyak transaksi)
users ──< addresses                          (1 pembeli : banyak alamat)
users ──1 stores ──< products                (1 penjual : 1 toko : banyak produk)
users ──1 carts ──< cart_items >── products  (1 pembeli : 1 keranjang : banyak item)
users (buyer) ──< orders >── stores
orders ──< order_items >── products
orders ──1 deliveries >── users (driver)
orders ──< order_status_histories
vouchers / promos
application_reviews
revoked_tokens
sim_clock

Copy to clipboard
Insert at cursor

### Daftar Tabel

Modul Autentikasi & Peran:
- users: `id`, `username` (unik), `email`, `password` (hash bcrypt),
  `auth_provider` ("local"), `is_admin` (boolean), `created_at`, `updated_at`.
  Tidak ada kolom role tunggal.
- user_roles: `id`, `user_id`, `role` (buyer/seller/driver). Memungkinkan banyak
  peran. Admin tidak melalui tabel ini (memakai `is_admin`).
- revoked_tokens: `jti`, `expired_at`. Denylist logout.

Catatan admin: admin ditandai `is_admin = true` di tabel users dan dibuat lewat
seed data, bukan registrasi publik.

Modul Dompet & Alamat:
- wallets: `id`, `user_id` (unik), `balance`.
- wallet_transactions: `id`, `wallet_id`, `type` (topup/payment/refund),
  `amount`, `description`, `created_at`.
- addresses: `id`, `user_id`, `label`, `recipient`, `phone`, `full_address`.

Modul Toko & Produk:
- stores: `id`, `user_id` (pemilik), `name` (unik: constraint database +
  validasi backend), `description`.
- products: `id`, `store_id`, `name`, `description`, `price`, `stock`,
  `image_url` (opsional).

Modul Keranjang:
- carts: `id`, `user_id`, `store_id` (diisi saat item pertama; penegak aturan
  satu toko).
- cart_items: `id`, `cart_id`, `product_id`, `quantity`.

Modul Checkout & Pesanan:
- orders: `id`, `buyer_id`, `store_id`, `status`, `delivery_method`
  (instant/next_day/regular), `subtotal`, `discount`, `delivery_fee`, `tax`,
  `final_total`, `voucher_id` (opsional), `promo_id` (opsional), `address_id`,
  `created_simulated_day`, `due_simulated_day`.
- order_items: `id`, `order_id`, `product_id`, `product_name` (snapshot),
  `price` (snapshot), `quantity`.
- order_status_histories: `id`, `order_id`, `status`, `note`, `created_at`.

Modul Pengiriman & Pengemudi:
- deliveries: `id`, `order_id` (unik), `driver_id` (kosong sampai diambil),
  `status`, `earning`, `taken_at`, `completed_at`.

Modul Diskon:
- vouchers: `id`, `code` (unik), `discount_amount` (nominal tetap),
  `expired_at`, `remaining_usage`.
- promos: `id`, `code` (unik), `discount_amount` (nominal tetap), `expired_at`.
  Tanpa kuota usage.

Modul Ulasan Aplikasi:
- application_reviews: `id`, `reviewer_name`, `rating` (1-5), `comment`,
  `created_at`. Dapat dibuat tanpa login; komentar dibersihkan sebelum
  ditampilkan.

Modul Simulasi Waktu:
- sim_clock: satu baris. `current_day` (angka hari simulasi).

Total: 18 tabel.

---

## Bagian 4: Kontrak API

Konvensi:
- Awalan semua endpoint: `/api/...`
- Respons sukses: WebResponse[T]; respons error: ApiErrorResponse.
- Autentikasi: header `Authorization: Bearer <token>`.
- Kelompok rute: Guest (tanpa token), Public (tanpa token), Auth (wajib token).
  Rute Auth tertentu dijaga middleware peran.

Penanda akses:
- Tamu: tanpa login
- Token: wajib login
- Peran: X: wajib login dan peran aktif harus X
- Admin: wajib login dan is_admin = true

### Modul 1: Autentikasi & Peran
|  Method  | Endpoint                  | Akses | Keterangan                                           |
| :------: | :------------------------ | :---- | :--------------------------------------------------- |
| **POST** | `/api/users`              | Tamu  | Mendaftarkan pengguna baru                           |
| **POST** | `/api/users/_login`       | Tamu  | Login dan mengembalikan access token                 |
| **POST** | `/api/users/_logout`      | Token | Logout dan memasukkan token ke denylist              |
|  **GET** | `/api/users/_current`     | Token | Mengambil profil pengguna yang sedang login          |
|  **GET** | `/api/users/_roles`       | Token | Mengambil daftar role yang dimiliki pengguna         |
| **POST** | `/api/users/_select-role` | Token | Memilih role aktif dan menerbitkan access token baru |

Contoh pilih peran aktif:
```json
// request
{ "role": "seller" }
// response
{
  "data": { "token": "<JWT baru berisi active_role=seller>", "active_role": "seller" },
  "message": "Peran aktif diperbarui",
  "success": true
}
```

## Modul 2: Etalase Publik (Katalog)
|  Method | Endpoint            | Akses | Keterangan                                            |
| :-----: | :------------------ | :---- | :---------------------------------------------------- |
| **GET** | `/api/products`     | Tamu  | Mengambil daftar produk publik (mendukung pagination) |
| **GET** | `/api/products/:id` | Tamu  | Mengambil detail produk beserta informasi toko        |
| **GET** | `/api/stores/:id`   | Tamu  | Mengambil detail toko                                 |

## Modul 3: Ulasan Aplikasi
|  Method  | Endpoint       | Akses | Keterangan                                            |
| :------: | :------------- | :---- | :---------------------------------------------------- |
|  **GET** | `/api/reviews` | Tamu  | Mengambil daftar ulasan aplikasi                      |
| **POST** | `/api/reviews` | Tamu  | Mengirim ulasan aplikasi (nama, rating 1–5, komentar) |

## Modul 4: Toko (Penjual)
|  Method  | Endpoint            | Akses           | Keterangan                              |
| :------: | :------------------ | :-------------- | :-------------------------------------- |
|  **GET** | `/api/seller/store` | Peran: `seller` | Mengambil data toko milik penjual       |
| **POST** | `/api/seller/store` | Peran: `seller` | Membuat toko baru dengan nama yang unik |
|  **PUT** | `/api/seller/store` | Peran: `seller` | Memperbarui informasi toko              |

## Modul 5: Produk (Penjual)
|   Method   | Endpoint                   | Akses           | Keterangan                                 |
| :--------: | :------------------------- | :-------------- | :----------------------------------------- |
|   **GET**  | `/api/seller/products`     | Peran: `seller` | Mengambil daftar produk milik toko sendiri |
|  **POST**  | `/api/seller/products`     | Peran: `seller` | Membuat produk baru                        |
|   **PUT**  | `/api/seller/products/:id` | Peran: `seller` | Memperbarui produk milik sendiri           |
| **DELETE** | `/api/seller/products/:id` | Peran: `seller` | Menghapus produk milik sendiri             |

## Modul 6: Dompet & Alamat (Pembeli)
|   Method   | Endpoint                   | Akses          | Keterangan                                   |
| :--------: | :------------------------- | :------------- | :------------------------------------------- |
|   **GET**  | `/api/buyer/wallet`        | Peran: `buyer` | Mengambil saldo dan riwayat transaksi dompet |
|  **POST**  | `/api/buyer/wallet/_topup` | Peran: `buyer` | Melakukan isi ulang saldo (dummy)            |
|   **GET**  | `/api/buyer/addresses`     | Peran: `buyer` | Mengambil daftar alamat                      |
|  **POST**  | `/api/buyer/addresses`     | Peran: `buyer` | Menambahkan alamat baru                      |
|   **PUT**  | `/api/buyer/addresses/:id` | Peran: `buyer` | Memperbarui alamat                           |
| **DELETE** | `/api/buyer/addresses/:id` | Peran: `buyer` | Menghapus alamat                             |

## Modul 7: Keranjang (Pembeli)
|   Method   | Endpoint                     | Akses          | Keterangan                                                                         |
| :--------: | :--------------------------- | :------------- | :--------------------------------------------------------------------------------- |
|   **GET**  | `/api/buyer/cart`            | Peran: `buyer` | Mengambil isi keranjang belanja                                                    |
|  **POST**  | `/api/buyer/cart/_items`     | Peran: `buyer` | Menambahkan item ke keranjang (ditolak jika produk berasal dari toko yang berbeda) |
|   **PUT**  | `/api/buyer/cart/_items/:id` | Peran: `buyer` | Memperbarui kuantitas item di keranjang                                            |
| **DELETE** | `/api/buyer/cart/_items/:id` | Peran: `buyer` | Menghapus item dari keranjang                                                      |

## Modul 8: Checkout & Pesanan (Pembeli)
|  Method  | Endpoint                       | Akses          | Keterangan                                                |
| :------: | :----------------------------- | :------------- | :-------------------------------------------------------- |
| **POST** | `/api/buyer/checkout/_preview` | Peran: `buyer` | Menghitung ringkasan checkout tanpa membuat pesanan       |
| **POST** | `/api/buyer/checkout`          | Peran: `buyer` | Membuat pesanan, mengunci stok, dan memotong saldo dompet |
|  **GET** | `/api/buyer/orders`            | Peran: `buyer` | Mengambil riwayat pesanan                                 |
|  **GET** | `/api/buyer/orders/:id`        | Peran: `buyer` | Mengambil detail pesanan beserta riwayat status           |

## Modul 9: Diskon (Admin)
|  Method  | Endpoint                  | Akses          | Keterangan               |
| :------: | :------------------------ | :------------- | :----------------------- |
|  **GET** | `/api/admin/vouchers`     | Peran: `admin` | Mengambil daftar voucher |
| **POST** | `/api/admin/vouchers`     | Peran: `admin` | Membuat voucher baru     |
|  **GET** | `/api/admin/vouchers/:id` | Peran: `admin` | Mengambil detail voucher |
|  **GET** | `/api/admin/promos`       | Peran: `admin` | Mengambil daftar promo   |
| **POST** | `/api/admin/promos`       | Peran: `admin` | Membuat promo baru       |
|  **GET** | `/api/admin/promos/:id`   | Peran: `admin` | Mengambil detail promo   |

- Validasi kode diskon tidak menjadi endpoint terpisah; digabung di _preview dan checkout (kode dikirim di body).

## Modul 10: Pemrosesan Pesanan Penjual
|  Method  | Endpoint                          | Akses           | Keterangan                                                                      |
| :------: | :-------------------------------- | :-------------- | :------------------------------------------------------------------------------ |
|  **GET** | `/api/seller/orders`              | Peran: `seller` | Mengambil daftar pesanan yang masuk ke toko                                     |
| **POST** | `/api/seller/orders/:id/_process` | Peran: `seller` | Mengubah status pesanan dari **Sedang Dikemas** menjadi **Menunggu Pengiriman** |

## Modul 11: Pengiriman & Pengemudi
|  Method  | Endpoint                         | Akses           | Keterangan                                                                       |
| :------: | :------------------------------- | :-------------- | :------------------------------------------------------------------------------- |
|  **GET** | `/api/driver/jobs`               | Peran: `driver` | Mengambil daftar pekerjaan yang tersedia (status **Menunggu Pengiriman**)        |
|  **GET** | `/api/driver/jobs/:id`           | Peran: `driver` | Mengambil detail pekerjaan pengiriman                                            |
| **POST** | `/api/driver/jobs/:id/_take`     | Peran: `driver` | Mengambil pekerjaan secara atomik dan mengubah status menjadi **Sedang Dikirim** |
| **POST** | `/api/driver/jobs/:id/_complete` | Peran: `driver` | Menyelesaikan pengiriman dan mengubah status menjadi **Pesanan Selesai**         |
|  **GET** | `/api/driver/dashboard`          | Peran: `driver` | Mengambil ringkasan dashboard driver (pekerjaan aktif, riwayat, dan pendapatan)  |

## Modul 12: Laporan
|  Method | Endpoint                      | Akses           | Keterangan                      |
| :-----: | :---------------------------- | :-------------- | :------------------------------ |
| **GET** | `/api/buyer/reports/_expense` | Peran: `buyer`  | Mengambil ringkasan pengeluaran |
| **GET** | `/api/seller/reports/_income` | Peran: `seller` | Mengambil ringkasan pendapatan  |

## Modul 13: Pemantauan Admin
|  Method | Endpoint                     | Akses          | Keterangan                              |
| :-----: | :--------------------------- | :------------- | :-------------------------------------- |
| **GET** | `/api/admin/users`           | Peran: `admin` | Mengambil daftar pengguna               |
| **GET** | `/api/admin/stores`          | Peran: `admin` | Mengambil daftar toko                   |
| **GET** | `/api/admin/products`        | Peran: `admin` | Mengambil daftar produk                 |
| **GET** | `/api/admin/orders`          | Peran: `admin` | Mengambil daftar pesanan                |
| **GET** | `/api/admin/deliveries`      | Peran: `admin` | Mengambil daftar pengiriman             |
| **GET** | `/api/admin/orders/_overdue` | Peran: `admin` | Mengambil daftar pesanan yang terlambat |

## Modul 14: Keterlambatan & Simulasi Waktu
|  Method  | Endpoint                        | Akses          | Keterangan                                                                          |
| :------: | :------------------------------ | :------------- | :---------------------------------------------------------------------------------- |
|  **GET** | `/api/admin/sim-clock`          | Peran: `admin` | Mengambil informasi hari simulasi saat ini                                          |
| **POST** | `/api/admin/sim-clock/_advance` | Peran: `admin` | Memajukan hari simulasi sebanyak **+1 hari** dan mengevaluasi keterlambatan pesanan |


## Contoh Payload: Checkout Preview

### Request

```json
{
  "delivery_method": "regular",
  "voucher_code": "HEMAT10",
  "promo_code": "PROMOJUNI",
  "address_id": "addr_123"
}
```

### Response

```json
{
  "data": {
    "subtotal": 100000,
    "discount": 15000,
    "taxable": 85000,
    "tax": 10200,
    "delivery_fee": 10000,
    "final_total": 105200,
    "voucher_applied": {
      "code": "HEMAT10",
      "amount": 10000
    },
    "promo_applied": {
      "code": "PROMOJUNI",
      "amount": 5000
    }
  },
  "message": "Ringkasan checkout",
  "success": true
}
```

### Urutan Perhitungan

1. Hitung **subtotal** seluruh produk.
2. Kurangi **diskon** (voucher + promo).
3. Hitung **PPN 12%** dari nilai setelah diskon (`taxable`).
4. Tambahkan **ongkos kirim**.
5. Hasil akhirnya menjadi **final_total**.

> **Catatan**
>
> - Ongkos kirim **tidak dikenakan PPN**.
> - Rumus:
>
> ```text
> taxable     = subtotal - discount
> tax         = taxable × 12%
> final_total = taxable + tax + delivery_fee
> ```

---

# Bagian 5: Mesin Status Pesanan (State Machine)

## Daftar Status
| Status | Deskripsi | Terminal |
| :----- | :-------- | :------: |
| **Sedang Dikemas** | Status awal setelah checkout berhasil | ❌ |
| **Menunggu Pengiriman** | Penjual telah memproses pesanan dan menunggu driver | ❌ |
| **Sedang Dikirim** | Driver telah mengambil pesanan | ❌ |
| **Pesanan Selesai** | Pesanan berhasil diterima pembeli | ✅ |
| **Dikembalikan** | Pesanan dikembalikan karena keterlambatan | ✅ |

## Alur Perubahan Status
```text
Sedang Dikemas
        │
        ▼
Menunggu Pengiriman
        │
        ▼
Sedang Dikirim
        │
        ▼
Pesanan Selesai
```

### Jalur Keterlambatan
```text
Sedang Dikemas
        │
        ├───────────────► Dikembalikan
        │
Menunggu Pengiriman
        │
        ├───────────────► Dikembalikan
        │
Sedang Dikirim
        │
        ├───────────────► Dikembalikan
        │
Pesanan Selesai
```

## Diagram Transisi Status
```text
                    ┌─────────────────────┐
                    │      Checkout       │
                    └──────────┬──────────┘
                               │
                               ▼
                   ┌─────────────────────┐
                   │  Sedang Dikemas     │
                   └───────┬───────┬─────┘
                           │       │
      Penjual Proses       │       │ Lewat batas waktu
                           ▼       ▼
              ┌─────────────────────┐
              │ Menunggu Pengiriman │
              └───────┬───────┬─────┘
                      │       │
 Driver Ambil (Atomik)│       │ Lewat batas waktu
                      ▼       ▼
              ┌─────────────────────┐
              │  Sedang Dikirim     │
              └───────┬───────┬─────┘
                      │       │
 Driver Selesai       │       │ Lewat batas waktu
                      ▼       ▼
          ┌─────────────────┐ ┌─────────────────┐
          │ Pesanan Selesai │ │  Dikembalikan   │
          └─────────────────┘ └─────────────────┘
```

### Daftar Transisi
| Dari                  | Ke                    | Trigger                           |
| :-------------------- | :-------------------- | :-------------------------------- |
| `Checkout`            | `Sedang Dikemas`      | Checkout berhasil                 |
| `Sedang Dikemas`      | `Menunggu Pengiriman` | Penjual memproses pesanan         |
| `Menunggu Pengiriman` | `Sedang Dikirim`      | Driver mengambil pesanan (atomik) |
| `Sedang Dikirim`      | `Pesanan Selesai`     | Driver menyelesaikan pengiriman   |
| `Sedang Dikemas`      | `Dikembalikan`        | Melewati batas waktu              |
| `Menunggu Pengiriman` | `Dikembalikan`        | Melewati batas waktu              |
| `Sedang Dikirim`      | `Dikembalikan`        | Melewati batas waktu              |

> **Status terminal**
>
> - ✅ `Pesanan Selesai`
> - ✅ `Dikembalikan`
>
> Kedua status tersebut bersifat **terminal**, sehingga tidak dapat berpindah ke status lain.

## Tabel Transisi Sah
| Dari                  | Ke                    | Pemicu                | Siapa     | Syarat                                               |
| :-------------------- | :-------------------- | :-------------------- | :-------- | :--------------------------------------------------- |
| *(Tidak ada)*         | `Sedang Dikemas`      | Checkout berhasil     | Pembeli   | Saldo mencukupi dan stok tersedia                    |
| `Sedang Dikemas`      | `Menunggu Pengiriman` | Proses pesanan        | Penjual   | Hanya penjual pemilik toko                           |
| `Menunggu Pengiriman` | `Sedang Dikirim`      | Ambil pekerjaan       | Pengemudi | Proses atomik dan belum ada pengemudi yang mengambil |
| `Sedang Dikirim`      | `Pesanan Selesai`     | Selesaikan pengiriman | Pengemudi | Hanya pengemudi yang mengambil pekerjaan             |
| `Sedang Dikemas`      | `Dikembalikan`        | Lewat batas waktu     | Sistem    | Dievaluasi saat **Majukan Hari** dan status overdue  |
| `Menunggu Pengiriman` | `Dikembalikan`        | Lewat batas waktu     | Sistem    | Dievaluasi saat **Majukan Hari** dan status overdue  |
| `Sedang Dikirim`      | `Dikembalikan`        | Lewat batas waktu     | Sistem    | Dievaluasi saat **Majukan Hari** dan status overdue  |

## Aturan State Machine
- Transisi status **di luar tabel transisi sah harus ditolak**.
- Sistem **wajib memvalidasi status saat ini** sebelum melakukan perubahan status.
- Setiap transisi **wajib mencatat riwayat status** ke tabel `order_status_histories` yang berisi:
  - Status baru
  - Waktu perubahan (`created_at`)
- Status terminal:
  - `Pesanan Selesai`
  - `Dikembalikan`
- Status terminal **tidak dapat berubah ke status lain**.
- Status `Dikembalikan` hanya dapat dicapai dari tiga status non-terminal:
  - `Sedang Dikemas`
  - `Menunggu Pengiriman`
  - `Sedang Dikirim`
- Pesanan yang sudah berstatus `Pesanan Selesai` **tidak boleh** berubah menjadi `Dikembalikan`.

---

## Efek Samping Tiap Transisi
| Transisi            | Efek Samping Wajib                                                                                                                                             |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `→ Sedang Dikemas`  | Mengurangi stok (row locking), memotong saldo dompet, mencatat `wallet_transactions` bertipe `payment`, dan membuat data `deliveries`.                         |
| `→ Sedang Dikirim`  | Mengisi `driver_id` secara atomik serta mencatat `taken_at`.                                                                                                   |
| `→ Pesanan Selesai` | Menghitung pendapatan pengemudi sebesar **80% dari ongkir**, mencatat pendapatan penjual, dan mengisi `completed_at`.                                          |
| `→ Dikembalikan`    | Mengembalikan dana ke dompet (`refund`) beserta pencatatan transaksi, memulihkan stok, tidak menghitung pendapatan penjual, serta proses harus **idempotent**. |


---

## Aturan Transaksi
Seluruh perubahan **status** dan **efek samping** harus dijalankan **dalam satu transaksi database (database transaction)**.

Apabila salah satu proses gagal, maka:

- Seluruh perubahan harus di-rollback.
- Status pesanan tidak boleh berubah.
- Efek samping (stok, dompet, pendapatan, pengiriman, dan histori) tidak boleh tersimpan sebagian.

# Bagian 6: Desain Modul Kritis

---

## Modul Kritis 1: Checkout (Penguncian Stok)

### Tujuan

Menjamin proses checkout berjalan **aman, konsisten, dan bebas race condition**.

### Alur Proses

> Seluruh langkah berikut **wajib dijalankan dalam SATU transaksi database**.

```text
BEGIN TRANSACTION

1. Ambil keranjang beserta seluruh item.
   └─ Jika keranjang kosong → ROLLBACK.

2. Ambil seluruh produk menggunakan
   SELECT ... FOR UPDATE.

3. Validasi stok.
   └─ Jika ada stok kurang → ROLLBACK.

4. Hitung total pembayaran.
   subtotal
        ↓
   diskon
        ↓
   taxable
        ↓
   PPN 12%
        ↓
   ongkir
        ↓
   final_total

5. Ambil dompet menggunakan
   SELECT ... FOR UPDATE.

   └─ Jika saldo kurang → ROLLBACK.

6. Kurangi stok seluruh produk.

7. Potong saldo dompet.

8. Catat wallet_transactions
   (type = payment).

9. Kurangi remaining_usage voucher
   (jika digunakan).

10. Buat Order
    status = Sedang Dikemas.

11. Snapshot seluruh order_items.

12. Catat order_status_histories pertama.

13. Buat deliveries
    driver_id = NULL
    earning   = 0

14. Simpan
    created_simulated_day
    due_simulated_day

15. Kosongkan keranjang.

COMMIT
```

### Perhitungan Checkout

```text
subtotal     = Σ(harga × kuantitas)
discount     = voucher + promo
taxable      = subtotal − discount
tax          = 12% × taxable
delivery_fee = sesuai metode
final_total  = taxable + tax + delivery_fee
```

### SLA Pengiriman

| Metode | Due Day |
| :------ | :------ |
| Instant | `created + 0` |
| Next Day | `created + 1` |
| Regular | `created + 3` |

---

## Modul Kritis 2: Ambil Pekerjaan Pengemudi (Atomik)

### Tujuan

Menjamin **hanya satu pengemudi** yang dapat mengambil satu pekerjaan.

### Mekanisme

Gunakan **UPDATE bersyarat**.

```sql
UPDATE deliveries
SET
    driver_id = :driver_id,
    taken_at  = NOW()
WHERE
    order_id = :order_id
    AND driver_id IS NULL
    AND order_status = 'Menunggu Pengiriman';
```

### Evaluasi

| Rows Affected | Hasil |
| :-----------: | :---- |
| **1** | Berhasil. Status order → `Sedang Dikirim` dan catat status history. |
| **0** | Gagal. Kembalikan pesan **"Pekerjaan sudah diambil."** |

### Alasan

Tidak menggunakan pola:

```text
SELECT
↓
UPDATE
```

karena terdapat race condition.

Menggunakan:

```text
Conditional UPDATE
```

membuat pengecekan dan perubahan data terjadi **secara atomik**.

---

## Modul Kritis 3: Proses Keterlambatan (Idempotent)

### Tujuan

Mengembalikan pesanan yang melewati batas waktu **tanpa risiko diproses dua kali**.

### Alur Proses

```text
1. current_day += 1

2. Cari seluruh order yang:
   • belum selesai
   • belum dikembalikan
   • due_day < current_day

3. Untuk setiap order:

BEGIN TRANSACTION

a. Lock order
   (SELECT FOR UPDATE)

b. Jika status sudah
   Dikembalikan
   → SKIP

c. Refund saldo
   + wallet_transactions

d. Pulihkan stok

e. Pendapatan penjual
   tidak dihitung

f. Status →
   Dikembalikan

g. Catat
   order_status_histories

COMMIT
```

---

## Ringkasan Mekanisme Proteksi
| Modul | Mekanisme Utama |
| :----- | :-------------- |
| Checkout | Row Lock (`SELECT FOR UPDATE`) + Database Transaction |
| Ambil Pekerjaan | Conditional `UPDATE` (Atomik) |
| Keterlambatan | Idempotent Guard + Row Lock + Database Transaction |