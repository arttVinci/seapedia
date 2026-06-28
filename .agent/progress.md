# Progress - SEAPEDIA Marketplace

> Pelacak status seluruh task dari workflow.md. Diperbarui oleh agen setiap kali
> task berubah status. Orchestrator membaca file ini sebelum menugaskan task baru.
>
> Penanda:
> [ ] todo | [/] in progress | [x] done (sudah merge) | [!] blocked
>
> Format baris: [status] ID - nama (Agen) -- catatan/branch/MR bila ada

---

## Ringkasan Tingkat

| Tingkat                           | Status        | Catatan                     |
| --------------------------------- | ------------- | --------------------------- |
| 1 Fondasi                         | dalam progres | T1-01, T1-02, T1-03 selesai |
| 2 Toko & Produk                   | belum mulai   | -                           |
| 3 Dompet, Keranjang, Checkout     | dalam progres | T3-01, T3-02, T3-03 selesai |
| 4 Diskon, Proses Pesanan, Laporan | belum mulai   | -                           |
| 5 Pengiriman & Pengemudi          | belum mulai   | -                           |
| 6 Admin, Keterlambatan, Simulasi  | belum mulai   | -                           |
| 7 Keamanan & Dokumentasi          | belum mulai   | -                           |

Checkpoint: setiap tingkat butuh persetujuan manusia sebelum lanjut.

---

## Tingkat 1: Fondasi

- [x] T1-01 Setup proyek BE (Backend) -- branch: chore/setup-backend, MR: https://github.com/arttVinci/seapedia/pull/new/chore/setup-backend
- [x] T1-02 Setup proyek FE (Frontend) -- branch: chore/setup-frontend, MR: https://github.com/arttVinci/seapedia/pull/new/chore/setup-frontend
- [x] T1-03 Migration & entity: users, user_roles, revoked_tokens (Backend) -- branch: feature/auth-migration-entity, MR: https://github.com/arttVinci/seapedia/pull/new/feature/auth-migration-entity
- [x] T1-04 Register + Login + Logout + JWT + denylist (Backend) -- branch: feature/auth-register-login, MR: https://github.com/arttVinci/seapedia/pull/new/feature/auth-register-login
- [x] T1-05 Endpoint peran: \_roles, \_select-role, \_current (Backend) -- branch: feature/auth-register-login, MR: https://github.com/arttVinci/seapedia/pull/new/feature/auth-register-login
- [x] T1-06 Middleware role + proteksi route (Backend) -- branch: feature/role-middleware, MR: https://github.com/arttVinci/seapedia/pull/new/feature/role-middleware
- [x] T1-07 Entity + endpoint katalog publik read-only (Backend) -- branch: feature/public-catalog, MR: https://github.com/arttVinci/seapedia/pull/new/feature/public-catalog
- [x] T1-08 Entity + endpoint application_reviews (Backend) -- branch: feature/application-reviews, MR: https://github.com/arttVinci/seapedia/pull/new/feature/application-reviews
- [x] T1-09 UI komponen reusable + layout (Frontend)
- [x] T1-10 Halaman publik: home, katalog, detail, ulasan (Frontend)
- [x] T1-11 Halaman login, register, pemilihan peran, shell dashboard (Frontend)
- [x] T1-12 Review tingkat 1 (QA)

## Tingkat 2: Toko & Produk

- [x] T2-01 Migration + entity: stores, products (Backend) -- branch: feature/seller-store, MR: https://github.com/arttVinci/seapedia/pull/new/feature/seller-store
- [x] T2-02 CRUD store penjual (nama unik) (Backend) -- branch: feature/seller-store, MR: https://github.com/arttVinci/seapedia/pull/new/feature/seller-store
- [x] T2-03 CRUD produk penjual (cek kepemilikan) (Backend)
- [x] T2-04 UI dashboard penjual: kelola store & produk (Frontend) -- branch: refactor/t2-api-integration
- [x] T2-05 Integrasi katalog publik dengan data nyata (Frontend) -- branch: refactor/t2-api-integration
- [x] T2-06 Review tingkat 2 (QA)

## Tingkat 3: Dompet, Alamat, Keranjang, Checkout Dasar

- [x] T3-01 Migration + entity: wallets, wallet_transactions, addresses (Backend) -- branch: feature/buyer-wallet-address, MR: pending
- [x] T3-02 Wallet: saldo, top-up dummy, riwayat (Backend) -- branch: feature/buyer-wallet-address, MR: pending
- [x] T3-03 Address: CRUD alamat pembeli (Backend) -- branch: feature/buyer-wallet-address, MR: pending
- [x] T3-04 Migration + entity: carts, cart_items (Backend) -- branch: feature/buyer-cart, MR: https://github.com/arttVinci/seapedia/pull/new/feature/buyer-cart
- [x] T3-05 Cart: tambah/ubah/hapus item + aturan satu toko (Backend) -- branch: feature/buyer-cart, MR: https://github.com/arttVinci/seapedia/pull/new/feature/buyer-cart
- [x] T3-06 Migration + entity: orders, order_items, order_status_histories, deliveries (Backend) -- branch: feature/buyer-checkout
- [x] T3-07 Checkout preview (hitung ringkasan) (Backend) -- branch: feature/buyer-checkout
- [x] T3-08 Checkout (modul kritis: penguncian stok) (Backend) -- branch: feature/buyer-checkout
- [x] T3-09 Order history & detail pembeli (Backend) -- branch: feature/buyer-checkout
- [ ] T3-10 UI dompet & alamat (Frontend)
- [ ] T3-11 UI keranjang (Frontend)
- [x] T3-12 UI checkout + order history (Frontend) -- branch: feature/buyer-checkout-ui, MR: https://github.com/arttVinci/seapedia/pull/new/feature/buyer-checkout-ui
- [ ] T3-13 Review tingkat 3 (QA)

## Tingkat 4: Diskon, Pemrosesan Pesanan Penjual, Laporan

- [x] T4-01 Migration + entity: vouchers, promos (Backend) -- branch: feature/discounts-backend, MR: -
- [x] T4-02 Admin generate & list/detail voucher dan promo (Backend) -- branch: feature/discounts-backend, MR: -
- [x] T4-03 Integrasi diskon ke checkout (Backend) -- branch: feature/discounts-backend, MR: -
- [ ] T4-04 Pemrosesan pesanan penjual (Backend)
- [ ] T4-05 Laporan: pengeluaran pembeli & pendapatan penjual (Backend)
- [ ] T4-06 UI admin: voucher & promo (Frontend)
- [ ] T4-07 UI penjual: incoming order, proses, timeline (Frontend)
- [ ] T4-08 UI checkout: input kode diskon + efek (Frontend)
- [ ] T4-09 UI laporan buyer & seller (Frontend)
- [ ] T4-10 Review tingkat 4 (QA)

## Tingkat 5: Pengiriman & Pengemudi

- [ ] T5-01 Daftar & detail job pengemudi (Backend)
- [ ] T5-02 Ambil pekerjaan (modul kritis: update atomik) (Backend)
- [ ] T5-03 Selesaikan pekerjaan + earning (Backend)
- [ ] T5-04 Dashboard pengemudi (Backend)
- [ ] T5-05 UI pengemudi: job, ambil, selesai, dashboard (Frontend)
- [ ] T5-06 UI pelacakan pengiriman (buyer & seller) (Frontend)
- [ ] T5-07 Review tingkat 5 (QA)

## Tingkat 6: Pemantauan Admin, Keterlambatan, Simulasi Waktu

- [ ] T6-01 Migration + entity: sim_clock (Backend)
- [ ] T6-02 Endpoint pemantauan admin (Backend)
- [ ] T6-03 Definisi SLA + perhitungan due_simulated_day (Backend)
- [ ] T6-04 Majukan hari + proses keterlambatan (modul kritis: idempotent) (Backend)
- [ ] T6-05 UI admin: dashboard monitoring + Majukan Hari (Frontend)
- [ ] T6-06 UI admin: kelola voucher/promo data nyata (Frontend)
- [ ] T6-07 UI: hasil keterlambatan/refund terlihat (Frontend)
- [ ] T6-08 Review tingkat 6 (QA)

## Tingkat 7: Pengerasan Keamanan & Dokumentasi Final

- [ ] T7-01 Pengerasan anti-injeksi SQL (Backend)
- [ ] T7-02 Pembersihan anti-skrip berbahaya (Backend + Frontend)
- [ ] T7-03 Validasi field wajib menyeluruh (Backend)
- [ ] T7-04 Verifikasi RBAC & sesi menyeluruh (QA)
- [ ] T7-05 Dokumentasi API (Swagger) + seed data (Backend)
- [ ] T7-06 README + dokumentasi business rule (Backend)
- [ ] T7-07 Review akhir end-to-end (QA)

---

## Blocker Aktif

(belum ada)

## Catatan Eksekusi

- Agen memperbarui baris status + menautkan branch/merge request di catatan.
- Saat task blocked, ubah ke [!] dan tulis alasannya di bagian Blocker Aktif.
- Setelah seluruh task satu tingkat [x], minta persetujuan manusia (checkpoint)
  sebelum memulai tingkat berikutnya.
