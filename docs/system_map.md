# System Map - SEAPEDIA Marketplace

> Dokumen turunan dari Product Requirement Document (PRD) versi 1.0.
> Tujuan: memberikan peta tingkat tinggi sistem (modul, hubungan antar modul,
> dan urutan pembangunan) sebelum masuk ke desain teknis detail di
> Software Design Document (SDD).

> Dokumen ini BELUM membahas struktur tabel database maupun detail endpoint.
> Itu adalah ruang lingkup Software Design Document.

---

## 1. Gambaran Besar

┌───────────────────────────────────────────────────┐
│                   PENGGUNA                        │
│   Tamu · Pembeli · Penjual · Pengemudi · Admin    │
└───────────────────────┬───────────────────────────┘
                        │ HTTPS
                        ▼
┌───────────────────────────────────────────────────┐
│              FRONTEND (React + Vite)              │
│   Halaman publik · Dashboard privat per peran     │
└───────────────────────┬───────────────────────────┘
                        │ REST API (JSON)
                        ▼
┌───────────────────────────────────────────────────┐
│              BACKEND (Go + Fiber)                 │
│   Controller -> UseCase -> Repository             │
│   + Middleware Autentikasi & Otorisasi Peran      │
└───────────────────────┬───────────────────────────┘
                        │ GORM
                        ▼
┌───────────────────────────────────────────────────┐
│                  MySQL 8.0                        │
└───────────────────────────────────────────────────┘

---

## 2. Daftar Modul Backend

Sistem dipecah menjadi modul berdasarkan area bisnis. Tiap modul menjadi satu
kelompok kerja (entity + repository + usecase + controller) dan menjadi dasar
pembagian tugas antar agen.

| No | Modul | Tanggung Jawab | Peran Terkait |
|----|-------|----------------|---------------|
| 1 | Autentikasi & Peran | Daftar, masuk, keluar, kepemilikan banyak peran, pemilihan peran aktif, otorisasi server | Semua |
| 2 | Etalase Publik (Katalog) | Daftar & detail produk untuk Tamu, info toko | Tamu |
| 3 | Ulasan Aplikasi | Kirim & tampilkan ulasan tentang aplikasi (bukan produk) | Tamu / Semua |
| 4 | Toko | Buat & kelola profil toko, nama toko unik | Penjual |
| 5 | Produk | Buat, ubah, hapus produk milik toko sendiri | Penjual |
| 6 | Dompet & Alamat | Saldo, isi ulang dummy, riwayat transaksi, alamat kirim | Pembeli |
| 7 | Keranjang | Tambah/ubah/hapus item, aturan satu toko per keranjang | Pembeli |
| 8 | Checkout & Pesanan | Hitung total, buat pesanan, kurangi stok aman, riwayat status | Pembeli / Penjual |
| 9 | Diskon (Voucher & Promo) | Buat & validasi kode diskon saat checkout | Admin / Pembeli |
| 10 | Pemrosesan Pesanan Penjual | Penjual memproses pesanan masuk, pindah status | Penjual |
| 11 | Pengiriman & Pengemudi | Ambil pekerjaan, selesaikan, hitung pendapatan pengemudi | Pengemudi |
| 12 | Laporan | Ringkasan pengeluaran pembeli & pendapatan penjual | Pembeli / Penjual |
| 13 | Pemantauan Admin | Pantau pengguna, toko, produk, pesanan, diskon, pengiriman, pesanan terlambat | Admin |
| 14 | Keterlambatan & Simulasi Waktu | Aturan batas waktu pengiriman, pengembalian dana otomatis, majukan hari | Admin / Sistem |
| 15 | Keamanan & Validasi | Pencegahan injeksi SQL, pencegahan skrip berbahaya, validasi input | Semua (lintas modul) |

---

## 3. Hubungan Antar Modul (Alur Pesanan & Alur Uang)

Bagian ini adalah jantung sistem, karena di sinilah modul saling bergantung
dan tempat aturan bisnis paling rawan salah.

PEMBELI                                           PENJUAL
   │                                                 │
   │ 1. Isi keranjang (1 toko)                       │
   │ 2. Checkout                                     │
   │    ├─ hitung: subtotal − diskon                 │
   │    │          + PPN 12% + ongkir                │
   │    ├─ potong saldo Dompet                       │
   │    ├─ kurangi Stok (aman, pakai penguncian)     │
   │    └─ buat Pesanan -> status "Sedang Dikemas"   │
   │                                                 │
   │                          3. Penjual proses ─────┤
   │                             status -> "Menunggu │
   │                             Pengirim"           │
   ▼                                                 ▼
PENGEMUDI
   │ 4. Ambil pekerjaan (hanya "Menunggu Pengirim")
   │    └─ status -> "Sedang Dikirim"
   │       (1 pengemudi saja, pakai penguncian)
   │ 5. Selesai -> status -> "Pesanan Selesai"
   │    └─ pendapatan pengemudi = 80% ongkir
   ▼
SISTEM (dipicu Admin "Majukan Hari")
   │ 6. Jika lewat batas waktu & belum selesai -> Terlambat
   │    └─ pengembalian dana otomatis:
   │       ├─ dana balik ke Dompet pembeli + catat riwayat
   │       ├─ stok dipulihkan
   │       ├─ pendapatan penjual tidak dihitung
   │       └─ status -> "Dikembalikan"
   │    (dijaga agar tidak terjadi dua kali / idempotent)

Copy to clipboard
Insert at cursor

Catatan istilah:
- "idempotent" = operasi yang jika dijalankan berkali-kali hasilnya tetap sama
  seperti dijalankan sekali. Contoh: jika pengembalian dana terpicu dua kali,
  saldo pembeli tetap hanya bertambah satu kali.

---

## 4. Lapisan Lintas Modul

Tiga hal berikut bukan modul tersendiri, melainkan aturan yang melekat di
semua modul:

- Otorisasi berbasis peran aktif: tiap permintaan ke server diperiksa apakah
  peran aktif pengguna boleh melakukan aksi tersebut. Diperiksa di server,
  bukan hanya disembunyikan di tampilan.
- Riwayat status: tiap perubahan status pesanan dicatat beserta waktunya.
  Sistem tidak boleh mengubah pesanan secara diam-diam.
- Keamanan input: semua input dari pengguna divalidasi dan dibersihkan sebelum
  disimpan atau ditampilkan.

---

## 5. Urutan Pembangunan (mengikuti 7 tingkat di Product Requirement Document)

Tingkat 1 -> Modul 1, 2, 3 + fondasi tampilan
Tingkat 2 -> Modul 4, 5 (+ integrasi katalog)
Tingkat 3 -> Modul 6, 7, 8 (dasar)
Tingkat 4 -> Modul 8 (lanjut), 9, 10, 12
Tingkat 5 -> Modul 11
Tingkat 6 -> Modul 13, 14
Tingkat 7 -> Modul 15 + dokumentasi akhir

---

## 6. Catatan Arsitektur Penting

- Pemrosesan Pesanan Penjual (Modul 10) dipisahkan dari Checkout & Pesanan
  (Modul 8) walaupun sama-sama soal pesanan, karena pelakunya berbeda
  (pembeli vs penjual) dan terjadi pada waktu berbeda. Pemisahan ini membuat
  batas kerja antar agen lebih jelas.
- Keamanan & Validasi (Modul 15) dijadikan modul tersendiri walaupun bersifat
  lintas modul, karena merupakan Tingkat 7 dan dinilai khusus.
- Dompet & Alamat digabung menjadi satu modul (6) karena keduanya dikelola
  pembeli di area yang sama, walaupun secara data terpisah.

---

## 7. Keputusan Teknis Terbuka (akan dikunci di Software Design Document)

Daftar ini berasal dari Open Issue pada Product Requirement Document ditambah
celah arsitektur yang teridentifikasi saat membandingkan dengan basis kode
yang sudah ada. Semua HARUS dijawab di Software Design Document.

1. Peran aktif disimpan di dalam token JWT (keputusan sementara: peran aktif
   menjadi bagian dari klaim token; mengganti peran berarti menerbitkan token
   baru). Final di Software Design Document.
2. Mekanisme penguncian saat pengemudi mengambil pekerjaan, agar satu pesanan
   hanya bisa diambil satu pengemudi (tanpa pengambilan ganda).
3. Mekanisme keamanan stok saat checkout bersamaan, agar stok tidak menjadi
   negatif.
4. Mekanisme logout yang benar-benar membatalkan token atau sesi (basis kode
   lama tidak membatalkan token saat logout, sedangkan Product Requirement
   Document mewajibkan pembatalan).
5. Desain otorisasi berbasis peran aktif (middleware pemeriksa peran), karena
   basis kode lama hanya memiliki autentikasi dan pemeriksaan kepemilikan,
   belum memiliki otorisasi berbasis peran.
6. Granularitas waktu untuk batas waktu pengiriman Instant.
7. Titik waktu pencatatan pendapatan penjual (saat pesanan selesai), sehingga
   pembalikan pendapatan umumnya tidak diperlukan namun tetap disediakan.