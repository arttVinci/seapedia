# Seapedia — Marketplace Multi-Seller

Platform e-commerce fullstack yang menghubungkan **Pembeli**, **Penjual**, dan **Pengemudi (Driver)** dalam satu pasar, lengkap dengan peran **Admin** untuk monitoring.

Dibangun dalam **5 hari** untuk mengejar deadline kompetisi (info kompetisi baru diketahui saat waktu sudah mepet), menggunakan **multi-agent AI workflow** sebagai tim development.

> ⏱️ Status: dikembangkan bertahap mengikuti 7 Tingkat di [`docs/PRD.md`](docs/PRD.md), saat ini progres ada di Tingkat 5 (modul Driver & Pengiriman). Lihat [`docs/system_map.md`](docs/system_map.md) untuk peta modul lengkap.

<!--
  TODO: tambahkan screenshot/GIF demo di sini, contoh:
  ![Demo Seapedia](docs/assets/demo.gif)
-->

---

## Daftar Isi

- [Live Demo](#live-demo)
- [Demo Accounts](#demo-accounts)
- [Tech Stack](#tech-stack)
- [Arsitektur](#arsitektur)
- [Struktur Proyek](#struktur-proyek)
- [Cara Menjalankan di Local](#cara-menjalankan-di-local)
- [Deployment & Infra](#deployment--infra)
- [Workflow Pengembangan (Multi-Agent AI)](#workflow-pengembangan-multi-agent-ai)
- [Fitur Utama](#fitur-utama)
- [Aturan Bisnis](#aturan-bisnis)
- [Security Notes](#security-notes)
- [API Docs](#api-docs)
- [Demo Flow (End-to-End)](#demo-flow-end-to-end)
- [Dokumentasi Lengkap](#dokumentasi-lengkap)

---

## Live Demo

|                | URL                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| 🌐 Frontend    | [seapedia.pages.dev](https://seapedia.pages.dev)                                                                     |
| 🌐 Backend API | [seapedia-api-97290399817.asia-southeast2.run.app/api](https://seapedia-api-97290399817.asia-southeast2.run.app/api) |

## Demo Accounts

Semua akun menggunakan password yang sama: **`admin123`**

Login bisa menggunakan **username** atau **email**.

**🛍️ Buyer** — Saldo dompet Rp 50.000.000

| Username | Email               |
| -------- | ------------------- |
| buyer1   | buyer1@seapedia.com |
| buyer2   | buyer2@seapedia.com |

**Driver**

| Username | Email                |
| -------- | -------------------- |
| driver1  | driver1@seapedia.com |
| driver2  | driver2@seapedia.com |

**Seller**

| Username         | Email                         | Toko         |
| ---------------- | ----------------------------- | ------------ |
| seller_apple     | seller_apple@seapedia.com     | iBox KW      |
| seller_fashion   | seller_fashion@seapedia.com   | Style OOTD   |
| seller_olahraga  | seller_olahraga@seapedia.com  | Sportivo     |
| seller_sepatu    | seller_sepatu@seapedia.com    | Shoe Center  |
| seller_rumah     | seller_rumah@seapedia.com     | Homey Living |
| seller_laptop    | seller_laptop@seapedia.com    | Laptop Store |
| seller_handphone | seller_handphone@seapedia.com | HP Store     |
| seller_gaming    | seller_gaming@seapedia.com    | Gaming Store |

**Admin**

| Email              |
| ------------------ |
| admin@seapedia.com |

---

## Tech Stack

| Layer            | Teknologi                                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Frontend         | React 19 + TypeScript, Vite, TanStack React Query, React Router, Tailwind CSS v4, shadcn/ui, Radix UI, Axios, Framer Motion |
| Backend          | Go 1.25, Fiber v2, GORM, Viper (config), go-playground/validator, JWT (golang-jwt), bcrypt, Logrus                          |
| Database         | MySQL 8 (local/Docker) — TiDB Cloud (production)                                                                            |
| Media Storage    | Cloudinary (upload gambar produk)                                                                                           |
| Containerization | Docker & Docker Compose                                                                                                     |

## Arsitektur

Backend mengikuti **clean/layered architecture**:

```
Controller  ->  UseCase  ->  Repository  ->  GORM  ->  MySQL
  (HTTP)       (business        (akses DB)
                 logic)
```

- **Entity** — model GORM yang merepresentasikan tabel database.
- **Repository** — satu-satunya layer yang boleh menyentuh `*gorm.DB` secara langsung.
- **UseCase** — tempat business logic: validasi, kalkulasi, transaksi atomik (mis. checkout memakai `SELECT ... FOR UPDATE` untuk mengunci stok produk, saldo wallet, dan kuota voucher agar aman saat diakses bersamaan).
- **Controller** — menerima request, memanggil usecase, mengembalikan response JSON.
- **Middleware** — `AuthMiddleware` (validasi JWT) dan `RoleMiddleware` (otorisasi berbasis peran aktif), diterapkan per grup route (`/api/buyer`, `/api/seller`, `/api/driver`, `/api/admin`).

Frontend mengikuti pola **service → query/mutation hook → page**:

```
services/        -> Axios client per domain (auth, cart, product, dst.)
hooks/queries     -> TanStack Query (GET / data fetching)
hooks/mutations   -> TanStack Query (POST/PUT/DELETE)
pages/            -> dipisah per peran (buyer/, seller/, driver/, admin/)
components/ui     -> shared UI (shadcn-style)
```

Alur tingkat tinggi:

```
Pengguna (Tamu/Buyer/Seller/Driver/Admin)
        │ HTTPS
        ▼
Frontend (React + Vite) — Cloudflare Pages
        │ REST API (JSON)
        ▼
Backend (Go + Fiber) — Google Cloud Platform
   Controller -> UseCase -> Repository
   + Middleware Auth & Role
        │ GORM
        ▼
MySQL / TiDB Cloud
```

## Struktur Proyek

```
seapedia/
├── FE/                       # Frontend React + TypeScript
│   └── src/
│       ├── @types/           # Type definitions (models, api)
│       ├── api/               # Axios client + interceptor
│       ├── components/        # Shared UI components
│       ├── contexts/          # React contexts (Auth)
│       ├── hooks/
│       │   ├── queries/       # Data fetching hooks
│       │   └── mutations/     # Data mutation hooks
│       ├── pages/              # Page components per peran
│       └── services/           # API service classes
├── BE/                        # Backend Go + Fiber
│   └── internal/
│       ├── config/             # App configuration (Fiber, GORM, Viper, Cloudinary, dll)
│       ├── db/migrations/      # SQL migration files
│       ├── delivery/http/      # Routes, controllers, middleware
│       ├── entity/             # GORM entity models
│       ├── model/              # Request/response DTO + converter
│       ├── repository/         # Database access layer
│       └── usecase/            # Business logic layer
├── docker-compose.yml          # Orkestrasi BE + MySQL untuk local
└── docs/                       # Dokumentasi proyek
    ├── PRD.md                  # Product Requirement Document
    ├── SDD.md                  # Software Design Document
    └── system_map.md           # Peta modul & alur sistem
```

## Cara Menjalankan di Local

Backend + database dijalankan via **Docker Compose** (`seapedia_be` + `seapedia_mysql`). Frontend dijalankan terpisah via `npm` karena belum punya Dockerfile sendiri.

### Prasyarat

- Docker & Docker Compose
- Node.js 18+ (untuk menjalankan frontend)
- Akun Cloudinary (untuk fitur upload gambar produk)
- [`golang-migrate`](https://github.com/golang-migrate/migrate) CLI (untuk menjalankan migration)

### 1. Clone Repository

```bash
git clone https://github.com/arttVinci/seapedia.git
cd seapedia
```

### 2. Setup Environment

**a. Buat `.env` di root project** (dipakai `docker-compose.yml` untuk MySQL & koneksi BE → DB):

```bash
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=seapedia
MYSQL_USER=seapedia_user
MYSQL_PASSWORD=seapedia_password
DB_PORT_EXTERNAL=3306
```

**b. Buat `BE/config.json`** (config aplikasi backend, dibaca via Viper — beberapa key di-override otomatis oleh `docker-compose.yml` lewat env `DB_HOST`/`DB_USER`/`DB_PASSWORD`/`DB_NAME`):

```json
{
  "app": {
    "name": "Seapedia"
  },
  "web": {
    "port": 8080,
    "prefork": false
  },
  "log": {
    "level": 5
  },
  "database": {
    "host": "seapedia_mysql",
    "port": 3306,
    "username": "seapedia_user",
    "password": "seapedia_password",
    "name": "seapedia",
    "pool": {
      "idle": 10,
      "max": 100,
      "lifetime": 300
    }
  },
  "jwt": {
    "secret": "ganti_dengan_secret_yang_kuat",
    "expired": 72
  },
  "cloudinary": {
    "cloud_name": "your_cloud_name",
    "api_key": "your_api_key",
    "api_secret": "your_api_secret"
  }
}
```

**c. Buat `FE/.env`** (untuk frontend):

```bash
VITE_API_URL=http://localhost:8080/api
VITE_AUTH_TOKEN=auth_token
```

### 3. Docker Build

```bash
docker compose build
```

Ini akan membangun image backend dari `BE/Dockerfile`.

### 4. Compose Up

```bash
docker compose up -d
```

Menjalankan dua container:

- `seapedia_mysql` — MySQL 8, expose ke `localhost:${DB_PORT_EXTERNAL}`
- `seapedia_be` — backend Go + Fiber, expose ke `localhost:8080`

Cek statusnya:

```bash
docker compose ps
docker compose logs -f seapedia_be
```

### 5. DB / Migration

Setelah container MySQL siap, jalankan migration dari folder `BE/db/migrations`:

```bash
migrate -path BE/db/migrations \
  -database "mysql://seapedia_user:seapedia_password@tcp(127.0.0.1:${DB_PORT_EXTERNAL}/seapedia)" up
```

> Sesuaikan `${DB_PORT_EXTERNAL}` dengan port yang di-set di `.env` root (default `3306`).

Backend sekarang siap diakses di `http://localhost:8080`.

### 6. Setup FE

Frontend dijalankan terpisah (di luar Docker). Buat `FE/.env` jika belum (lihat langkah 2c), lalu:

```bash
cd FE
```

### 7. npm install

```bash
npm install
```

### 8. npm run dev

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` (default port Vite) dan langsung terhubung ke backend di `http://localhost:8080`.

### Menghentikan Container

```bash
docker compose down          # stop & hapus container
docker compose down -v       # stop & hapus container + volume DB (reset total)
```

## Deployment & Infra

| Komponen              | Layanan                     |
| --------------------- | --------------------------- |
| Backend               | Google Cloud Platform (GCP) |
| Frontend              | Cloudflare Pages            |
| Database              | TiDB Cloud                  |
| Media/Gambar          | Cloudinary                  |
| Monitoring & Auto-Fix | **Hermes** (agent otonom)   |

**Hermes** adalah agent otonom yang memantau log production di GCP secara real-time:

- Jika menemukan error ringan, Hermes akan **memperbaikinya sendiri** dan membuat **Pull Request** ke repository.
- Jika menemukan error berat, Hermes akan **melapor via Telegram**: penjelasan errornya apa, root cause-nya, dan langkah perbaikan yang disarankan — tanpa langsung mengubah kode.

## Workflow Pengembangan (Multi-Agent AI)

Proyek ini dibangun dengan workflow multi-agent karena waktu pengerjaan yang sangat terbatas (5 hari sejak info kompetisi diterima). Pembagian kerjanya:

| Tahap                                           | Tool / Tempat Kerja                                                    | LLM yang Dipakai                          |
| ----------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------- |
| Perancangan (SDD, System Map, Workflow, Skills) | —                                                                      | Claude Opus                               |
| Planning Task                                   | —                                                                      | GLM, Claude Opus                          |
| Implementasi / Coding                           | **Trae** (orkestrasi multi-agent coding)                               | DeepSeek V4 Pro, Gemini 3.1 Pro, Qwen 3.6 |
| Review Code & Monitoring Agent                  | **Antigravity** (tempat kerja utama dev, untuk review & fix bug agent) | —                                         |
| QA / Review                                     | —                                                                      | GPT                                       |
| Monitoring Production & Auto-Fix                | Hermes (agent otonom di GCP)                                           | —                                         |

Alur singkatnya:

1. **Claude Opus** merancang dokumen desain teknis (SDD, system map) dan skill yang dipakai agent-agent implementasi.
2. **GLM & Claude Opus** memecah desain jadi task-task konkret per modul/tingkat.
3. Task dikerjakan oleh agent-agent coding di **Trae**, menggunakan DeepSeek V4 Pro, Gemini 3.1 Pro, dan Qwen 3.6 sebagai LLM penulis kode.
4. Semua hasil kerja agent direview, di-debug, dan dipantau lewat **Antigravity** sebagai tempat kerja utama.
5. **GPT** berperan sebagai QA — memvalidasi Definition of Done tiap modul terhadap PRD/SDD/system map sebelum dianggap selesai (lihat contoh hasilnya di [`QA_REPORT_LEVEL5.md`](QA_REPORT_LEVEL5.md)).
6. Setelah deploy, **Hermes** menjaga stabilitas production secara otonom.

## Fitur Utama

- **Katalog Publik** — Browsing produk & toko tanpa login
- **Autentikasi Multi-Role** — Buyer, Seller, Driver, Admin (satu akun bisa punya banyak peran, ganti peran = terbitkan token baru)
- **Manajemen Toko & Produk** — Seller CRUD produk + upload gambar (Cloudinary)
- **Dompet & Alamat** — Top-up wallet (dummy), riwayat transaksi, multi-address
- **Keranjang Single-Store** — Satu keranjang hanya boleh berisi produk dari satu toko. Jika Buyer mencoba menambahkan produk dari toko berbeda, sistem menolak dengan error 409 dan menampilkan pesan konflik di UI. Aturan ini ditegakkan di backend (`cart_usecase.go`).
- **Checkout** — PPN 12%, `SELECT FOR UPDATE` untuk mengunci stok/wallet/voucher, transaksi atomik
- **Riwayat Pesanan** — Order tracking + status history
- **Pengiriman** — Driver job workflow (ambil job dengan atomic conditional update agar tidak ada double-take, earning driver = 80% dari ongkir)
- **Voucher & Promo** — Sistem kode diskon, validasi masa berlaku & kuota
- **Admin Dashboard** — Monitoring toko, produk, voucher, dan promo

## Aturan Bisnis

### Keranjang Single-Store

Seapedia adalah marketplace multi-seller. Satu keranjang hanya boleh berisi produk dari **satu toko**. Jika Buyer mencoba menambahkan produk dari toko yang berbeda, sistem menolak dengan error `409 Conflict`. Buyer harus mengosongkan keranjang terlebih dahulu sebelum bisa berbelanja di toko lain. Aturan ini ditegakkan di backend (`cart_usecase.go`) dan ditampilkan dengan pesan konflik di UI.

### Kalkulasi Checkout

```
Subtotal        = Σ (harga × qty) semua item
Discount        = nominal dari Voucher atau Promo (jika dipakai)
Delivery Fee    = bergantung metode pengiriman
Tax (PPN 12%)   = (Subtotal - Discount) × 12%
Final Total     = Subtotal - Discount + Delivery Fee + Tax
```

**Delivery Fee per metode:**

| Metode     | Fee       |
| ---------- | --------- |
| `instant`  | Rp 20.000 |
| `next_day` | Rp 15.000 |
| `regular`  | Rp 10.000 |

### Aturan Diskon (Voucher & Promo)

- Hanya **satu kode diskon** yang bisa digunakan per checkout.
- Sistem mencari kode di tabel Promo terlebih dahulu, kemudian Voucher — keduanya tidak bisa digabung dalam satu transaksi.
- Voucher memiliki **expiry date** dan **kuota penggunaan** (`remaining_usage`). Keduanya divalidasi saat checkout; jika kedaluwarsa atau kuota habis, checkout ditolak.
- Promo hanya memiliki **expiry date**.
- Diskon tidak boleh membuat subtotal menjadi negatif.

### Driver Earning

Driver mendapatkan **80% dari delivery fee** setiap kali berhasil menyelesaikan pengiriman. Earning dicatat di tabel `deliveries` saat delivery dibuat, dan ditampilkan di driver dashboard beserta riwayat job.

```
Driver Earning = Delivery Fee × 0.8
```

### Overdue SLA & Auto-Refund

Sistem menggunakan **simulated day** (bukan waktu real) untuk kalkulasi overdue. Admin dapat menekan tombol **+1 Hari** di dashboard untuk memajukan hari simulasi. Setiap kali hari dimajukan, sistem mengecek order yang melewati SLA-nya.

**SLA per metode pengiriman:**

| Metode     | SLA (simulated day)                             |
| ---------- | ----------------------------------------------- |
| `instant`  | 0 hari (harus diambil driver di hari yang sama) |
| `next_day` | 1 hari                                          |
| `regular`  | 3 hari                                          |

**Mekanisme auto-refund saat overdue:**

1. Order dengan status `Sedang Dikemas` atau `Menunggu Pengirim` yang melewati `due_simulated_day` akan diubah statusnya ke `Dikembalikan`.
2. `FinalTotal` dikembalikan penuh ke **wallet Buyer** dan dicatat sebagai transaksi `refund`.
3. **Stok produk** di-restore sesuai quantity order item.
4. Status history disimpan dengan timestamp dan catatan `"SLA Overdue"`.
5. Proses ini bersifat atomik (dalam satu database transaction) sehingga tidak terjadi double-refund.

> Karena overdue hanya dipicu sebelum driver mengambil pesanan, seller income belum pernah dikreditkan — sehingga tidak diperlukan reversal income penjual.

### Main Order Lifecycle

```
[Checkout] → Sedang Dikemas
                  ↓ (Seller proses)
            Menunggu Pengirim
                  ↓ (Driver ambil job)
             Sedang Dikirim
                  ↓ (Driver konfirmasi selesai)
            Pesanan Selesai

[Overdue / SLA lewat] → Dikembalikan
```

---

## Security Notes

### SQL Injection

Seluruh akses database menggunakan **GORM ORM** dengan query builder dan parameterized binding. Tidak ada raw string concatenation untuk membentuk query SQL. Untuk operasi atomik khusus (take job driver), digunakan `tx.Exec()` dengan placeholder `?` — bukan string interpolation.

### XSS (Cross-Site Scripting)

Frontend dibangun dengan **React + TypeScript**. Semua nilai variabel yang dirender ke DOM melalui JSX (`{value}`) secara otomatis di-escape oleh React — tidak ada penggunaan `dangerouslySetInnerHTML`. Review/komentar publik dirender sebagai teks biasa, bukan HTML mentah.

### Input Validation

Backend menggunakan **go-playground/validator** untuk memvalidasi semua request body sebelum diproses usecase. Contoh aturan yang diterapkan:

| Field             | Rule                        |
| ----------------- | --------------------------- |
| `username`        | `required, min=3, max=50`   |
| `email`           | `required, email`           |
| `password`        | `required, min=6`           |
| `role`            | `oneof=buyer seller driver` |
| `rating` (review) | `min=1, max=5`              |

Request yang tidak lolos validasi langsung dikembalikan dengan HTTP `400 Bad Request` dan pesan error yang deskriptif.

### Session & Token

- Autentikasi menggunakan **JWT (HS256)** dengan expiry **72 jam**.
- Saat logout, **JTI (JWT ID)** token disimpan ke tabel `revoked_tokens` (denylist). Setiap request berikutnya dicek apakah JTI-nya sudah direvoke.
- Token expired dibersihkan dari tabel denylist secara periodik berdasarkan kolom `expired_at`.

### Role-Based Access Control (RBAC)

- **Active role** disimpan langsung di dalam JWT payload — bukan hanya di frontend.
- Setiap grup route (`/api/seller`, `/api/buyer`, `/api/driver`, `/api/admin`) dilindungi oleh `AuthMiddleware` (validasi token) + `RoleMiddleware` (verifikasi active role).
- Validasi ownership dilakukan di level usecase: seller hanya bisa memodifikasi produk/order miliknya sendiri, driver hanya bisa mengambil job yang belum diambil driver lain.
- Backend tidak mempercayai informasi role yang datang dari request body atau query param — semua diambil dari JWT yang sudah diverifikasi.

---

## Demo Flow (End-to-End)

Urutan ini bisa digunakan untuk menguji seluruh alur sistem dari awal hingga selesai menggunakan akun seed yang sudah tersedia (password semua: `admin123`).

### 1. Guest Flow

1. Buka [seapedia.pages.dev](https://seapedia.pages.dev) tanpa login.
2. Browse katalog produk dan buka detail produk.
3. Submit review aplikasi (nama, rating, komentar) — tampil di homepage.

### 2. Buyer Flow

1. Login sebagai `buyer1` → pilih role **Buyer**.
2. Top-up wallet di menu Dompet.
3. Tambahkan beberapa produk dari **satu toko** ke keranjang.
4. Coba tambahkan produk dari toko lain → sistem menolak (konflik single-store).
5. Buka halaman Checkout → pilih metode pengiriman → masukkan kode voucher/promo (bisa dibuat via Admin) → lihat ringkasan subtotal, diskon, ongkir, PPN 12%, total.
6. Konfirmasi checkout → order muncul di riwayat pesanan.

### 3. Seller Flow

1. Login sebagai `seller_apple` → pilih role **Seller**.
2. Lihat order masuk di menu Pesanan dengan status `Sedang Dikemas`.
3. Klik **Proses** → status berubah ke `Menunggu Pengirim`.

### 4. Driver Flow

1. Login sebagai `driver1` → pilih role **Driver**.
2. Buka menu Cari Job → job dari order tadi muncul.
3. Ambil job → status order berubah ke `Sedang Dikirim`.
4. Konfirmasi selesai → status berubah ke `Pesanan Selesai`, earning driver tercatat.

### 5. Admin Flow

1. Login sebagai `admin@seapedia.com` → langsung masuk Admin Dashboard.
2. Pantau statistik: total user, toko, produk, order, delivery.
3. Buat Voucher atau Promo baru di menu Voucher/Promo.
4. Tekan **+1 Hari** untuk memajukan simulated day — sistem otomatis mendeteksi order overdue, merefund wallet buyer, dan merestore stok.

### 6. Overdue Demo

1. Buat order baru sebagai Buyer (jangan diambil driver).
2. Login sebagai Admin → tekan **+1 Hari** berulang hingga melewati SLA.
3. Order otomatis berubah ke `Dikembalikan`, saldo wallet Buyer bertambah kembali.

---

## API Docs

Interactive API documentation tersedia via **Swagger UI** — dibangun otomatis dari annotation di source code menggunakan `swaggo/fiber-swagger`.

|                            | URL                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔗 Swagger UI (production) | [seapedia-api-97290399817.asia-southeast2.run.app/swagger/index.html](https://seapedia-api-97290399817.asia-southeast2.run.app/swagger/index.html) |
| 🔗 Swagger UI (local)      | [localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)                                                                      |

Swagger tersedia setelah container backend berjalan. Semua endpoint sudah terdokumentasi lengkap dengan request body, response schema, dan autentikasi Bearer Token — bisa dicoba langsung dari browser tanpa client lain.

> Untuk endpoint yang memerlukan autentikasi, klik **Authorize** di Swagger UI dan masukkan token dengan format: `Be
