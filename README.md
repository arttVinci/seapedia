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

- [Tech Stack](#tech-stack)
- [Arsitektur](#arsitektur)
- [Struktur Proyek](#struktur-proyek)
- [Cara Menjalankan di Local](#cara-menjalankan-di-local)
- [Deployment & Infra](#deployment--infra)
- [Workflow Pengembangan (Multi-Agent AI)](#workflow-pengembangan-multi-agent-ai)
- [Fitur Utama](#fitur-utama)
- [Dokumentasi Lengkap](#dokumentasi-lengkap)

---

## Tech Stack

| Layer    | Teknologi                                                            |
| -------- | -------------------------------------------------------------------- |
| Frontend | React + TypeScript + Vite, TanStack React Query, Tailwind CSS, Axios |
| Backend  | Go + Fiber, GORM, JWT, bcrypt, Wire (DI)                             |
| Database | MySQL                                                                |

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

- Go 1.21+
- Node.js 18+
- MySQL 8+

### Backend

```bash
VITE_API_URL=http://localhost:8080/api
VITE_AUTH_TOKEN=auth_token
```

### Frontend

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

| Komponen | Layanan |
|----------|---------|
| Backend | Google Cloud Platform (GCP) |
| Frontend | Cloudflare Pages |
| Database | TiDB Cloud |
| Media/Gambar | Cloudinary |
| Monitoring & Auto-Fix | **Hermes** (agent otonom) |

**Hermes** adalah agent otonom yang memantau log production di GCP secara real-time:
- Jika menemukan error ringan, Hermes akan **memperbaikinya sendiri** dan membuat **Pull Request** ke repository.
- Jika menemukan error berat, Hermes akan **melapor via Telegram**: penjelasan errornya apa, root cause-nya, dan langkah perbaikan yang disarankan — tanpa langsung mengubah kode.

## Workflow Pengembangan (Multi-Agent AI)

Proyek ini dibangun dengan workflow multi-agent karena waktu pengerjaan yang sangat terbatas (5 hari sejak info kompetisi diterima). Pembagian kerjanya:

| Tahap | Tool / Tempat Kerja | LLM yang Dipakai |
|-------|----------------------|-------------------|
| Perancangan (SDD, System Map, Workflow, Skills) | — | Claude Opus |
| Planning Task | — | GLM, Claude Opus |
| Implementasi / Coding | **Trae** (orkestrasi multi-agent coding) | DeepSeek V4 Pro, Gemini 3.1 Pro, Qwen 3.6 |
| Review Code & Monitoring Agent | **Antigravity** (tempat kerja utama dev, untuk review & fix bug agent) | — |
| QA / Review | — | GPT |
| Monitoring Production & Auto-Fix | Hermes (agent otonom di GCP) | — |

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

## Dokumentasi Lengkap

- [PRD (Product Requirement Document)](docs/PRD.md)
- [SDD (Software Design Document)](docs/SDD.md)
- [System Map](docs/system_map.md)
- [QA Report Level 5](QA_REPORT_LEVEL5.md)
