# Workflow - SEAPEDIA Marketplace

> Rencana eksekusi turunan dari Product Requirement Document, System Map, dan
> Software Design Document. Berisi task graph (task + dependensi), penugasan agen,
> skill yang dipakai, dan Definition of Done (kriteria selesai yang terukur).
>
> Disusun per tingkat mengikuti 7 tingkat di Product Requirement Document.
> Tiap akhir tingkat adalah checkpoint: manusia menyetujui sebelum lanjut.

---

## Aturan Umum

Format task:

```text
[ID] Nama task
  Agen: Backend / Frontend / QA
  Skill: <skill yang dipakai, atau ->
  Depends: <task lain, atau ->
  Done when:
    - kriteria terukur
```

Prinsip contract-first: Backend membuat entity + endpoint sesuai Kontrak API.
Frontend tidak menunggu Backend selesai; Frontend memakai data tiruan (mock)
sesuai Kontrak API agar dapat bekerja paralel. Keduanya bertemu di kontrak yang
sama.

Aturan eksekusi: satu slice fungsional = satu branch = satu merge request.
Commit bertahap (tidak di-squash). Agen memperbarui progress.md setelah selesai.

---

## Alur Tiga Fase per Task (wajib)

Setiap task mengikuti alur: PLANNING -> IMPLEMENTASI -> REVIEW.

1. PLANNING
   - Agen membaca dokumen acuan yang relevan (sdd.md, AGENTS.md, skill terkait),
     lalu menyusun rencana TANPA menulis kode.
   - Rencana mencakup: file yang akan dibuat/diubah, dependency (bila ada),
     pendekatan teknis, dan bagaimana Definition of Done akan dipenuhi.
   - Manusia (atau orchestrator) menyetujui rencana sebelum implementasi dimulai.

2. IMPLEMENTASI
   - Agen menulis kode sesuai rencana yang disetujui, dalam satu branch
     (git-convention), dengan commit bertahap.

3. REVIEW
   - seapedia-qa-agent memverifikasi Definition of Done dan aturan bisnis kritis.
   - Manusia melakukan review akhir dan merge.

Kedalaman PLANNING proporsional dengan risiko task:
- Task kritis (checkout/penguncian stok, ambil pekerjaan/atomik,
  keterlambatan/idempotent): planning WAJIB detail (algoritma, transaksi,
  penanganan konkurensi, kasus gagal).
- Task setup atau CRUD standar: planning ringkas cukup (struktur, file, langkah
  utama). Hindari over-planning pada task sederhana.

Aturan: jangan melompat langsung ke implementasi tanpa fase planning yang
disetujui, terutama untuk task kritis.

## Ekstraksi Skill (Skill Extraction Checkpoint)

Selain skill yang sudah di-seed di .agent/skills/, skill baru dapat lahir dari
pola berulang yang ditemukan selama implementasi. Aturannya:

1. Waktu: dilakukan di akhir tiap tingkat, bersamaan dengan review QA tingkat
   tersebut (bukan di tengah task).
2. Identifikasi: seapedia-qa-agent (atau agen pelaksana) mengidentifikasi pola
   yang berulang di >=2 tempat dan berpotensi dipakai lagi di tingkat berikutnya.
3. Usulan, bukan keputusan: agen hanya MENGUSULKAN kandidat skill (nama + alasan
   + di mana polanya muncul). Agen TIDAK membuat file skill sendiri tanpa
   persetujuan.
4. Keputusan: manusia memutuskan dengan uji kelayakan: "Apakah pola ini akan
   dipakai lagi di fitur/tingkat lain?" Jika ya, layak; jika hanya sekali pakai,
   tolak.
5. Pembuatan: setelah disetujui, agen mengekstrak pola menjadi file skill baru
   di .agent/skills/ mengikuti format skill yang ada (kapan dipakai, aturan
   wajib, contoh, kesalahan yang dihindari).
6. Penerapan: skill baru wajib dirujuk pada task-task berikutnya yang relevan,
   dan ditambahkan ke daftar skill agen terkait di AGENTS.md bila perlu.

Jangan meng-extract skill untuk pola yang hanya dipakai sekali. Skill adalah
pola reusable, bukan catatan per-fitur.


## Tingkat 1: Fondasi (Auth, Peran, Katalog Publik, Ulasan, UI)

[T1-01] Setup proyek BE (Fiber, GORM, Viper, Logrus, struktur folder)
  Agen: Backend   Skill: -   Depends: -
  Done when:
    - Server jalan di port terkonfigurasi
    - Koneksi MySQL berhasil (connection pool sesuai SDD)
    - ErrorHandler global + WebResponse/ApiErrorResponse terpasang

[T1-02] Setup proyek FE (Vite, React, Router, TanStack, Tailwind)
  Agen: Frontend   Skill: -   Depends: -
  Done when:
    - Aplikasi jalan, routing publik & privat terpisah
    - Axios client + error wrapper siap

[T1-03] Migration & entity: users, user_roles, revoked_tokens
  Agen: Backend   Skill: crud-pattern   Depends: T1-01
  Done when:
    - Tabel terbuat sesuai ERD
    - users punya is_admin; tidak ada kolom role tunggal

[T1-04] Register + Login + Logout + JWT (active_role klaim) + denylist
  Agen: Backend   Skill: rbac-authorization, api-response-convention   Depends: T1-03
  Done when:
    - Register simpan user, password ter-hash bcrypt
    - Login kembalikan token; password salah ditolak
    - Logout memasukkan jti ke revoked_tokens; token itu lalu ditolak
    - Token kedaluwarsa sesuai aturan terdokumentasi

[T1-05] Endpoint peran: _roles, _select-role, _current
  Agen: Backend   Skill: rbac-authorization   Depends: T1-04
  Done when:
    - _roles kembalikan daftar peran user
    - _select-role terbitkan token baru berisi active_role
    - _current kembalikan profil user login
    - Identifikasi & usulkan kandidat skill baru dari pola berulang (jika ada)

[T1-06] Middleware role + proteksi route
  Agen: Backend   Skill: rbac-authorization   Depends: T1-05
  Done when:
    - Route salah peran ditolak 403
    - Endpoint admin ditolak untuk non-admin
    - User tidak bisa akses resource user lain

[T1-07] Entity + endpoint katalog publik (products, stores) read-only
  Agen: Backend   Skill: crud-pattern, api-response-convention   Depends: T1-03
  Done when:
    - GET /api/products (paging) & /api/products/:id jalan
    - GET /api/stores/:id jalan
    - Data dari backend (bukan dummy)

[T1-08] Entity + endpoint application_reviews
  Agen: Backend   Skill: crud-pattern   Depends: T1-03
  Done when:
    - POST /api/reviews bisa tanpa login; rating di luar 1-5 ditolak
    - GET /api/reviews kembalikan daftar

[T1-09] UI komponen reusable + layout (Button, Input, Card, Navbar, Footer)
  Agen: Frontend   Skill: -   Depends: T1-02
  Done when:
    - Komponen dipakai di >1 halaman
    - Layout responsif desktop & mobile

[T1-10] Halaman publik: home, katalog, detail produk, ulasan
  Agen: Frontend   Skill: api-response-convention   Depends: T1-09, (mock T1-07/T1-08)
  Done when:
    - Home bernuansa marketplace, akses tanpa login
    - Listing & detail produk tampil untuk tamu
    - Form ulasan + daftar ulasan tampil

[T1-11] Halaman login, register, pemilihan peran, shell dashboard
  Agen: Frontend   Skill: api-response-convention   Depends: T1-09, (mock T1-04/T1-05)
  Done when:
    - Login/register berfungsi terhubung API
    - Modal pilih peran muncul untuk user multi-peran; single-role tidak dipaksa
    - Active role terlihat jelas; shell dashboard 4 peran dapat dibuka

[T1-12] Review tingkat 1
  Agen: QA   Skill: semua   Depends: T1-04..T1-11
  Done when:
    - Semua Done when di atas terverifikasi
    - Komentar ulasan tampil sebagai teks (tidak mengeksekusi script)
    - Identifikasi & usulkan kandidat skill baru dari pola berulang (jika ada)

Peta dependensi Tingkat 1:
```text
T1-01 ─┬─ T1-03 ─┬─ T1-04 ─ T1-05 ─ T1-06
       │         ├─ T1-07
       │         └─ T1-08
T1-02 ─── T1-09 ─┬─ T1-10   (mock T1-07/08)
                 └─ T1-11   (mock T1-04/05)
semua ─ T1-12 (QA)
```
---


## Tingkat 2: Toko & Produk (Penjual)
[T2-01] Migration + entity: stores, products
  Agen: Backend   Skill: crud-pattern   Depends: T1-03
  Done when: tabel sesuai ERD; nama store unik (constraint DB)

[T2-02] CRUD store penjual (nama unik: constraint + validasi)
  Agen: Backend   Skill: crud-pattern, rbac-authorization   Depends: T2-01, T1-06
  Done when: create/update store sendiri; nama duplikat ditolak (409)

[T2-03] CRUD produk penjual (cek kepemilikan)
  Agen: Backend   Skill: crud-pattern, rbac-authorization   Depends: T2-01, T1-06
  Done when: penjual hanya kelola produk tokonya; field sesuai ERD

[T2-04] UI dashboard penjual: kelola store & produk
  Agen: Frontend   Skill: api-response-convention   Depends: T1-11, (mock T2-02/03)
  Done when: form store & produk jalan; daftar produk hanya milik penjual

[T2-05] Integrasi katalog publik dengan data nyata
  Agen: Frontend   Skill: -   Depends: T1-10, T2-03
  Done when: katalog menampilkan produk nyata + info toko

[T2-06] Review tingkat 2
  Agen: QA   Skill: semua   Depends: T2-02..T2-05
  Done when: 
  - Kepemilikan ditegakkan; nama toko unik teruji
  - Identifikasi & usulkan kandidat skill baru dari pola berulang (jika ada)

Dependensi: T2-01 -> (T2-02 paralel T2-03) -> T2-04; T2-05 menunggu T2-03; QA terakhir.

---

## Tingkat 3: Dompet, Alamat, Keranjang, Checkout Dasar
[T3-01] Migration + entity: wallets, wallet_transactions, addresses
  Agen: Backend   Skill: crud-pattern   Depends: T1-03
  Done when: tabel sesuai ERD; 1 pembeli 1 dompet (unik)

[T3-02] Wallet: saldo, top-up dummy, riwayat transaksi
  Agen: Backend   Skill: crud-pattern, rbac-authorization   Depends: T3-01
  Done when:
    - Top-up menambah saldo & mencatat wallet_transactions(topup)
    - GET wallet menampilkan saldo + riwayat

[T3-03] Address: CRUD alamat pembeli
  Agen: Backend   Skill: crud-pattern, rbac-authorization   Depends: T3-01
  Done when: tambah/ubah/hapus alamat milik sendiri

[T3-04] Migration + entity: carts, cart_items
  Agen: Backend   Skill: crud-pattern   Depends: T2-01
  Done when: tabel sesuai ERD

[T3-05] Cart: tambah/ubah/hapus item + aturan satu toko
  Agen: Backend   Skill: crud-pattern, rbac-authorization   Depends: T3-04
  Done when:
    - Tambah produk dari toko berbeda ditolak dengan pesan jelas (opsi clear cart)
    - Ubah & hapus item berfungsi

[T3-06] Migration + entity: orders, order_items, order_status_histories, deliveries
  Agen: Backend   Skill: crud-pattern   Depends: T2-01, T3-01
  Done when: tabel sesuai ERD (termààsuk created/due_simulated_day)

[T3-07] Checkout preview (hitung ringkasan tanpa buat pesanan)
  Agen: Backend   Skill: money-calculation   Depends: T3-05, T3-06
  Done when:
    - Mengembalikan subtotal, discount, taxable, tax(12%), delivery_fee, final_total
    - PPN dari (subtotal - discount); ongkir bebas PPN; nilai dibulatkan

[T3-08] Checkout (modul kritis: penguncian stok + transaksi)
  Agen: Backend   Skill: money-calculation, order-status-machine   Depends: T3-07, T3-02
  Done when:
    - Stok dikurangi dengan SELECT FOR UPDATE; stok tidak pernah negatif
    - Saldo kurang -> ditolak, tidak ada perubahan (rollback)
    - Order dibuat status "Sedang Dikemas" + order_items snapshot
    - wallet_transactions(payment) tercatat; baris deliveries dibuat
    - order_status_histories baris pertama tercatat
    - delivery_method & due_simulated_day sesuai SLA

[T3-09] Order history & detail pembeli
  Agen: Backend   Skill: api-response-convention   Depends: T3-08
  Done when: GET orders & orders/:id (dengan status history) berfungsi

[T3-10] UI dompet & alamat (pembeli)
  Agen: Frontend   Skill: api-response-convention   Depends: T1-11, (mock T3-02/03)
  Done when: saldo, top-up, riwayat, kelola alamat tampil & berfungsi

[T3-11] UI keranjang (aturan satu toko terlihat)
  Agen: Frontend   Skill: api-response-convention   Depends: T1-11, (mock T3-05)
  Done when: tambah/ubah/hapus item; konflik beda toko ditampilkan jelas

[T3-12] UI checkout (ringkasan sebelum konfirmasi) + order history
  Agen: Frontend   Skill: api-response-convention   Depends: T3-11, (mock T3-07/08/09)
  Done when:
    - Pilih metode pengiriman; ringkasan (subtotal, diskon, ongkir, PPN, total)
      tampil sebelum konfirmasi
    - Order history & detail + timeline status tampil

[T3-13] Review tingkat 3
  Agen: QA   Skill: semua   Depends: T3-02..T3-12
  Done when:
    - Perhitungan uang benar (uji manual beberapa kasus)
    - Stok tidak negatif pada checkout bersamaan
    - Aturan satu toko ditegakkan di backend
    - Identifikasi & usulkan kandidat skill baru dari pola berulang (jika ada)

Dependensi inti: T3-06 + T3-05 -> T3-07 -> T3-08 -> T3-09. Jalur FE paralel via mock.

---

## Tingkat 4: Diskon, Pemrosesan Pesanan Penjual, Laporan
[T4-01] Migration + entity: vouchers, promos
  Agen: Backend   Skill: crud-pattern   Depends: T1-03
  Done when: tabel sesuai ERD; voucher punya remaining_usage, promo tidak

[T4-02] Admin generate & list/detail voucher dan promo
  Agen: Backend   Skill: crud-pattern, rbac-authorization   Depends: T4-01, T1-06
  Done when: endpoint admin voucher & promo berfungsi (hanya admin)

[T4-03] Integrasi diskon ke checkout preview & checkout
  Agen: Backend   Skill: money-calculation   Depends: T4-01, T3-08
  Done when:
    - Kode diskon divalidasi (kadaluarsa & sisa kuota voucher)
    - Maks 1 voucher + 1 promo; promo lalu voucher; keduanya sebelum PPN
    - Ringkasan membedakan kontribusi voucher vs promo
    - remaining_usage voucher berkurang saat checkout

[T4-04] Pemrosesan pesanan penjual (Sedang Dikemas -> Menunggu Pengirim)
  Agen: Backend   Skill: order-status-machine, rbac-authorization   Depends: T3-08
  Done when:
    - Hanya penjual pemilik yang memproses
    - Transisi tercatat di status history bertimestamp

[T4-05] Laporan: pengeluaran pembeli & pendapatan penjual
  Agen: Backend   Skill: money-calculation, api-response-convention   Depends: T3-08
  Done when: ringkasan pengeluaran buyer & income seller benar

[T4-06] UI admin: generate & list/detail voucher dan promo
  Agen: Frontend   Skill: api-response-convention   Depends: T1-11, (mock T4-02)
  Done when: form generate + list/detail + expiry & usage tampil

[T4-07] UI penjual: incoming order, proses order, timeline
  Agen: Frontend   Skill: api-response-convention   Depends: T2-04, (mock T4-04)
  Done when: daftar incoming, aksi proses, timeline status tampil

[T4-08] UI checkout: input kode diskon + tampil efek
  Agen: Frontend   Skill: api-response-convention   Depends: T3-12, (mock T4-03)
  Done when: input voucher/promo; efek diskon & beda voucher vs promo tampil

[T4-09] UI laporan buyer & seller
  Agen: Frontend   Skill: api-response-convention   Depends: T1-11, (mock T4-05)
  Done when: laporan pengeluaran & pendapatan tampil dengan rincian

[T4-10] Review tingkat 4
  Agen: QA   Skill: semua   Depends: T4-02..T4-09
  Done when:
    - kombinasi diskon benar; transisi penjual sah & tercatat
    - Identifikasi & usulkan kandidat skill baru dari pola berulang (jika ada)

---

## Tingkat 5: Pengiriman & Pengemudi
[T5-01] Daftar & detail job pengemudi (hanya Menunggu Pengirim)
  Agen: Backend   Skill: order-status-machine, rbac-authorization   Depends: T4-04
  Done when:
    - GET jobs hanya menampilkan order status Menunggu Pengirim
    - GET jobs/:id detail job

[T5-02] Ambil pekerjaan (modul kritis: update atomik anti-rebutan)
  Agen: Backend   Skill: order-status-machine   Depends: T5-01
  Done when:
    - Update bersyarat atomik; rows affected=1 menang, =0 ditolak
    - Status order -> Sedang Dikirim; driver_id terisi; taken_at tercatat
    - Tidak mungkin dua pengemudi mengambil order sama

[T5-03] Selesaikan pekerjaan + earning pengemudi
  Agen: Backend   Skill: order-status-machine, money-calculation   Depends: T5-02
  Done when:
    - Status -> Pesanan Selesai; completed_at tercatat
    - earning = 80% delivery_fee; pendapatan penjual dicatat
    - status history tercatat

[T5-04] Dashboard pengemudi (active job, history, earnings)
  Agen: Backend   Skill: api-response-convention   Depends: T5-03
  Done when: endpoint dashboard mengembalikan active, history, total earning

[T5-05] UI pengemudi: daftar job, detail, ambil, selesai, dashboard
  Agen: Frontend   Skill: api-response-convention   Depends: T1-11, (mock T5-01..04)
  Done when: alur cari->ambil->selesai jalan; dashboard tampil

[T5-06] UI pelacakan pengiriman (buyer & seller)
  Agen: Frontend   Skill: api-response-convention   Depends: T3-12, T4-07, (mock T5-02/03)
  Done when: buyer & seller dapat melihat progres status pengiriman

[T5-07] Review tingkat 5
  Agen: QA   Skill: semua   Depends: T5-02..T5-06
  Done when:
    - Tidak ada double-take; earning 80% benar; status tercatat
    - Identifikasi & usulkan kandidat skill baru dari pola berulang (jika ada)

---

## Tingkat 6: Pemantauan Admin, Keterlambatan, Simulasi Waktu
[T6-01] Migration + entity: sim_clock
  Agen: Backend   Skill: crud-pattern   Depends: T1-03
  Done when: satu baris current_day; bertahan setelah restart

[T6-02] Endpoint pemantauan admin (users, stores, products, orders, deliveries, overdue)
  Agen: Backend   Skill: rbac-authorization, api-response-convention   Depends: T5-03, T4-02
  Done when: semua endpoint monitoring admin berfungsi (hanya admin)

[T6-03] Definisi SLA + perhitungan due_simulated_day (verifikasi)
  Agen: Backend   Skill: order-status-machine   Depends: T3-08
  Done when: Instant 0 / Next Day 1 / Regular 3 hari sejak Menunggu Pengirim

[T6-04] Majukan hari + proses keterlambatan (modul kritis: idempotent)
  Agen: Backend   Skill: order-status-machine, money-calculation   Depends: T6-01, T6-03
  Done when:
    - _advance menambah current_day +1 dan mengevaluasi overdue
    - Order overdue (belum selesai, due < hari baru) -> Dikembalikan
    - Refund ke dompet + wallet_transactions(refund); stok dipulihkan
    - Pendapatan penjual tidak dihitung (reversal tersedia bila perlu)
    - Idempotent: tidak ada refund/stok/reversal ganda
    - Semua perubahan tercatat di status history bertimestamp

[T6-05] UI admin: dashboard monitoring + tombol Majukan Hari
  Agen: Frontend   Skill: api-response-convention   Depends: T1-11, (mock T6-02/04)
  Done when: monitoring tampil; tombol Majukan Hari memicu evaluasi

[T6-06] UI admin: kelola voucher/promo terhubung data nyata
  Agen: Frontend   Skill: -   Depends: T4-06, T4-02
  Done when: kelola voucher/promo dengan data nyata

[T6-07] UI: hasil keterlambatan/refund terlihat (buyer & admin)
  Agen: Frontend   Skill: api-response-convention   Depends: T6-05, (mock T6-04)
  Done when: status Dikembalikan & refund tampil di UI

[T6-08] Review tingkat 6
  Agen: QA   Skill: semua   Depends: T6-02..T6-07
  Done when:
    - overdue benar; idempotensi teruji (picu dua kali aman)
    - Identifikasi & usulkan kandidat skill baru dari pola berulang (jika ada)

---

## Tingkat 7: Pengerasan Keamanan & Dokumentasi Final
[T7-01] Pengerasan anti-injeksi SQL (parameterized/ORM-safe) menyeluruh
  Agen: Backend   Skill: rbac-authorization   Depends: semua endpoint
  Done when: payload SQL-like tidak mengubah perilaku query

[T7-02] Pembersihan/escape anti-skrip berbahaya (termasuk komentar ulasan)
  Agen: Backend + Frontend   Skill: -   Depends: T1-08
  Done when: tag script di komentar tidak tereksekusi; konten dibersihkan

[T7-03] Validasi field wajib menyeluruh
  Agen: Backend   Skill: crud-pattern   Depends: semua endpoint
  Done when: email, telepon, rating, quantity, price, stock, discount divalidasi;
             input invalid ditolak dengan pesan jelas

[T7-04] Verifikasi RBAC & sesi menyeluruh
  Agen: QA   Skill: rbac-authorization   Depends: semua endpoint
  Done when: admin-only aman; tidak ada akses resource user lain; logout
             membatalkan token

[T7-05] Dokumentasi API (Swagger) + seed data 4 peran
  Agen: Backend   Skill: -   Depends: semua endpoint
  Done when: Swagger lengkap; seed akun demo admin/seller/buyer/driver

[T7-06] README + dokumentasi business rule
  Agen: Backend   Skill: -   Depends: -
  Done when:
    - Setup + env vars; single-store checkout; aturan diskon & PPN 12%;
      earning driver; SLA & simulasi waktu; security notes; panduan testing demo

[T7-07] Review akhir end-to-end
  Agen: QA   Skill: semua   Depends: T7-01..T7-06
  Done when:
    - demo end-to-end 4 peran berjalan
    - Semua dokumentasi ada
    - Identifikasi & usulkan kandidat skill baru dari pola berulang (jika ada)

---

## Catatan Eksekusi

- Setiap akhir tingkat: checkpoint manusia sebelum lanjut.
- Merge request per slice, bukan per tingkat, agar mudah direview.
- Riwayat commit bertahap (tidak di-squash) sesuai kebutuhan.
- progress.md mencerminkan seluruh task di atas dan diperbarui agen.