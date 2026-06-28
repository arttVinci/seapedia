# SEAPEDIA - Marketplace Multi-Seller

Platform e-commerce fullstack yang menghubungkan **Seller**, **Buyer**, dan **Driver** dalam satu pasar.

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React + TypeScript + Vite, TanStack React Query, Tailwind CSS, Axios |
| Backend | Go + Fiber, GORM, JWT, bcrypt, Wire (DI) |
| Database | MySQL |

## Struktur Proyek

```
seapedia/
├── FE/                     # Frontend React + TypeScript
│   └── src/
│       ├── @types/         # Type definitions (models, api)
│       ├── api/            # Axios client + interceptor
│       ├── components/     # Shared UI components
│       ├── contexts/       # React contexts (Auth)
│       ├── hooks/          # TanStack Query hooks
│       │   ├── queries/    # Data fetching hooks
│       │   └── mutations/  # Data mutation hooks
│       ├── pages/          # Page components
│       └── services/       # API service classes
├── BE/                     # Backend Go + Fiber
│   └── internal/
│       ├── config/         # App configuration
│       ├── db/migrations/  # SQL migration files
│       ├── delivery/http/  # Routes, controllers, middleware
│       ├── entity/         # GORM entity models
│       ├── model/          # Request/response DTOs + converters
│       ├── repository/     # Database access layer
│       └── usecase/        # Business logic layer
└── docs/                   # Dokumentasi proyek
    ├── prd.md              # Product Requirement Document
    └── sdd.md              # Software Design Document
```

## Memulai Development

### Prasyarat
- Go 1.21+
- Node.js 18+
- MySQL 8+

### Backend
```bash
cd BE
cp .env.example .env   # sesuaikan konfigurasi
go run cmd/main.go
```

### Frontend
```bash
cd FE
cp .env.example .env   # pastikan VITE_API_BASE_URL + VITE_AUTH_TOKEN
npm install
npm run dev
```

## Fitur Utama

- **Katalog Publik**: Browsing produk tanpa login
- **Autentikasi Multi-Role**: Buyer, Seller, Driver, Admin
- **Manajemen Toko & Produk**: Seller CRUD produk
- **Dompet & Alamat**: Top-up wallet, multi-address
- **Keranjang Single-Store**: Cart enforcement satu toko
- **Checkout**: PPN 12%, SELECT FOR UPDATE, transaksi atomik
- **Riwayat Pesanan**: Order tracking + status history
- **Pengiriman**: Driver delivery workflow
- **Voucher & Promo**: Sistem diskon
- **Admin Dashboard**: Monitoring + overdue handling

## Dokumentasi Lengkap

- [PRD (Product Requirement Document)](docs/prd.md)
- [SDD (Software Design Document)](docs/sdd.md)
