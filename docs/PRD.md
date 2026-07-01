# PRD - SEAPEDIA Marketplace

> **Single Source of Truth.** Seluruh dokumen turunan (System Map, SDD, Workflow, ERD, API Contract, Task Breakdown, hingga implementasi) HARUS mengacu pada dokumen ini, bukan pada slide/PDF Technical Challenge. Jika terjadi konflik antara dokumen ini dan sumber lain, dokumen ini yang berlaku.
>
> Versi: 1.0 | Status: Baseline

---

## 1. Ringkasan Proyek

### 1.1 Tujuan Aplikasi
SEAPEDIA adalah platform e-commerce multi-seller (marketplace) yang menghubungkan **Seller**, **Buyer**, dan **Driver** dalam satu pengalaman pasar. Tujuan proyek adalah membangun aplikasi fullstack yang tidak hanya layak secara tampilan, tetapi juga mampu menjalankan alur marketplace nyata: katalog publik, autentikasi multi-role, pengelolaan toko & produk, dompet & checkout, diskon, pemrosesan pesanan, pengiriman oleh driver, monitoring admin, penanganan pesanan terlambat (overdue), dan pengerasan keamanan.

### 1.2 Scope
**In-scope (Core, 100 poin) dibangun progresif Level 1-7:**
1. Public marketplace, autentikasi, role awareness, application reviews, fondasi UI.
2. Seller store & product management, integrasi katalog publik.
3. Buyer wallet, address, cart (single-store), checkout, order dasar, PPN 12%.
4. Voucher & Promo, pemrosesan order oleh Seller, laporan Buyer & Seller.
5. Delivery job & workflow Driver, earning driver.
6. Admin monitoring, UI manajemen Voucher/Promo, overdue auto refund/return, simulasi waktu.
7. Security hardening (SQLi, XSS, validasi, RBAC, sesi) dan dokumentasi final.

**Bonus (terpisah, 25 poin):** kualitas UI (10) dan deployment (15).

**Out-of-scope dokumen ini:** System Map, SDD, ERD, API Contract, Workflow, Database Design, Arsitektur, dan Source Code. Dokumen ini hanya mendefinisikan requirement.

### 1.3 Stakeholder
- **Evaluator / Klien**: menilai kelengkapan, kebenaran business rule, kualitas kode, keamanan, dokumentasi, dan demo end-to-end.
- **Pengguna akhir**: Guest, Buyer, Seller, Driver, Admin.
- **Tim pengembang**: bertanggung jawab atas implementasi fullstack (client web ATAU mobile + backend API-based).

### 1.4 Daftar Role
| Role | Tipe | Multi-role? | Ringkasan |
|------|------|-------------|-----------|
| Guest | Tanpa akun | - | Browsing katalog & detail produk, baca & submit application review. |
| Buyer | Non-admin | Ya | Wallet, address, cart, checkout, order history, laporan pengeluaran. |
| Seller | Non-admin | Ya | Store, produk, proses order, laporan income. |
| Driver | Non-admin | Ya | Cari job, ambil job, selesaikan job, earning. |
| Admin | Admin | Dipisah | Monitoring marketplace, kelola voucher/promo, trigger operasional (overdue, simulasi waktu), halaman admin-only. |

### 1.5 Gambaran Marketplace
SEAPEDIA adalah pasar multi-seller: banyak toko menjual produk dalam satu katalog publik. Satu username non-admin dapat memiliki lebih dari satu role sekaligus dan harus memilih **active role** per sesi. Otorisasi mengikuti active role, bukan seluruh daftar role. Cart bersifat single-store. Alur uang melibatkan wallet buyer, income seller, dan earning driver, serta penyesuaian saat terjadi refund/return.

---

## 2. Functional Requirements

### A. Public Marketplace & UI (Level 1, 2)
- **FR-001** Menyediakan landing/home page SEAPEDIA yang mengomunikasikan identitas marketplace (bukan toko tunggal).
- **FR-002** Menyediakan halaman daftar produk (product listing) yang dapat diakses Guest.
- **FR-003** Menyediakan halaman detail produk read-only yang dapat diakses Guest.
- **FR-004** Menyediakan halaman login dan halaman register.
- **FR-005** Menyediakan komponen UI reusable (Button, Input, Card, Navbar/Top Bar, Footer/Bottom Navigation).
- **FR-006** Menyediakan struktur routing yang mendukung halaman publik dan dashboard privat.
- **FR-007** Menyediakan dashboard shell/placeholder untuk Admin, Seller, Buyer, dan Driver.
- **FR-008** Navigasi responsif untuk desktop dan mobile.
- **FR-009** Membedakan navigasi Guest dan navigasi user yang sudah login secara jelas.

### B. Autentikasi & Role Awareness (Level 1, 7)
- **FR-010** Registrasi user.
- **FR-011** Login dan logout user.
- **FR-012** Menyimpan password dengan hashing yang aman.
- **FR-013** Autentikasi request menggunakan token/JWT/session.
- **FR-014** Model data yang mendukung role Admin, Seller, Buyer, Driver.
- **FR-015** Satu username non-admin dapat memiliki lebih dari satu role sekaligus.
- **FR-016** Mengembalikan daftar role yang dimiliki user yang login.
- **FR-017** Memilih active role setelah login atau selama sesi.
- **FR-018** Menampilkan halaman/modal pemilihan role jika user punya >1 role non-admin.
- **FR-019** Memproteksi route privat dan endpoint API berdasarkan active role (diverifikasi server-side).
- **FR-020** Endpoint/payload yang mengembalikan profil user yang sedang login.
- **FR-021** Halaman profil/dashboard summary yang menampilkan role yang dimiliki dan active role saat ini.
- **FR-022** Menampilkan active role secara jelas di UI.
- **FR-023** Entry point/placeholder untuk ringkasan saldo/finansial lintas role pada username yang sama (nilai riil menyusul di level berikut).
- **FR-024** Logout meng-invalidasi/menghapus sesi atau token dengan benar.
- **FR-025** Mencegah akses resource milik user lain (produk seller lain, order buyer lain, job driver lain).
- **FR-026** Endpoint & halaman admin-only tidak dapat diakses non-admin.
- **FR-027** Menerapkan masa berlaku token/sesi yang wajar dan terdokumentasi.

### C. Application Reviews (Level 1, 7)
- **FR-028** Menyediakan section review/testimonial publik di landing atau halaman publik lain.
- **FR-029** Form submit review tentang pengalaman aplikasi/website SEAPEDIA (bukan review produk/order).
- **FR-030** Form review mencakup nama reviewer, rating 1-5, dan teks komentar.
- **FR-031** Menampilkan daftar review (list/testimonial/carousel).
- **FR-032** Review dapat digunakan tanpa checkout atau riwayat transaksi.
- **FR-033** Komentar ditampilkan sebagai teks normal, tidak merusak layout, dan tidak mengeksekusi script (sanitasi/escape penuh diuji di Level 7).

### D. Seller Store Management (Level 2)
- **FR-034** Model/resource store untuk Seller.
- **FR-035** Form Seller membuat/memperbarui profil store.
- **FR-036** Store memiliki field nama store.
- **FR-037** Validasi dan error jika nama store sudah dipakai (harus unik).
- **FR-038** Endpoint/blok ringkasan store publik.

### E. Seller Product Management & Katalog (Level 2)
- **FR-039** Model produk dengan field: nama, deskripsi, harga, stock, pemilik store.
- **FR-040** Seller membuat produk (endpoint + UI).
- **FR-041** Seller memperbarui produk (endpoint + UI).
- **FR-042** Seller menghapus produk (endpoint + UI).
- **FR-043** Dashboard Seller menampilkan daftar produk milik Seller yang login.
- **FR-044** Endpoint publik daftar produk (katalog berbasis data backend, bukan dummy).
- **FR-045** Endpoint publik detail produk.
- **FR-046** Menampilkan informasi store pada listing/detail produk.
- **FR-047** Halaman detail store atau blok informasi store di dalam detail produk.

### F. Buyer Wallet & Address (Level 3)
- **FR-048** Resource wallet/saldo Buyer.
- **FR-049** Flow top-up dummy untuk Buyer.
- **FR-050** Menyimpan dan menampilkan riwayat transaksi wallet.
- **FR-051** Manajemen alamat pengiriman (delivery address) Buyer.
- **FR-052** Menampilkan saldo Buyer dan riwayat top-up di dashboard Buyer.

### G. Cart (Level 3)
- **FR-053** Menambah produk ke cart.
- **FR-054** Mengubah kuantitas produk di cart.
- **FR-055** Menghapus produk dari cart.
- **FR-056** Endpoint dan UI ringkasan cart.
- **FR-057** Menerapkan single-store checkout: satu cart hanya boleh berisi produk dari satu store; konflik ditolak atau ditangani dengan jelas (minta clear cart).

### H. Checkout & Order (Level 3, 4)
- **FR-058** Endpoint checkout / create order.
- **FR-059** Mendukung delivery method: Instant, Next Day, Regular.
- **FR-060** Menghitung subtotal, discount, delivery fee, PPN 12%, dan final total.
- **FR-061** Menampilkan ringkasan checkout di UI sebelum konfirmasi (subtotal, discount, delivery fee, PPN 12%, final total).
- **FR-062** Membuat order sesuai perilaku single-store.
- **FR-063** Mengurangi stock produk secara aman setelah checkout berhasil (tanpa stock negatif).
- **FR-064** Order history dan order detail untuk Buyer.
- **FR-065** Daftar incoming order untuk Seller.
- **FR-066** Menyimpan status history order beserta timestamp.
- **FR-067** Mengisi delivery fee berbeda per delivery method.
- **FR-068** Status awal order setelah checkout berhasil adalah **Sedang Dikemas**.

### I. Voucher & Promo (Level 4, 6)
- **FR-069** Resource Voucher.
- **FR-070** Resource Promo.
- **FR-071** Endpoint Admin untuk generate voucher dan promo.
- **FR-072** Endpoint untuk list dan detail voucher serta promo.
- **FR-073** Voucher memiliki expiry date dan remaining usage.
- **FR-074** Promo memiliki expiry date.
- **FR-075** Checkout dapat menerima kode diskon.
- **FR-076** Validasi kode diskon saat checkout.
- **FR-077** Menampilkan efek diskon pada ringkasan checkout, dan membedakan Voucher vs Promo pada hasil validasi/ringkasan.
- **FR-078** UI Admin untuk generate voucher.
- **FR-079** UI Admin untuk generate promo.
- **FR-080** UI Admin untuk list & detail voucher.
- **FR-081** UI Admin untuk list & detail promo.
- **FR-082** Menampilkan expiry date dan informasi terkait usage di UI Admin.

### J. Seller Order Processing (Level 4)
- **FR-083** Aksi Seller untuk memproses incoming order.
- **FR-084** Memindahkan status order dari **Sedang Dikemas** ke **Menunggu Pengirim** setelah diproses Seller.
- **FR-085** Menyimpan perubahan status pada status history dengan timestamp.
- **FR-086** Menampilkan timeline/status tracker order di halaman Buyer dan Seller.

### K. Laporan Buyer & Seller (Level 4)
- **FR-087** Laporan pengeluaran/expense summary Buyer.
- **FR-088** Laporan income/revenue summary Seller.
- **FR-089** Menampilkan order history, order detail, dan status history bertimestamp Buyer.
- **FR-090** Menampilkan incoming orders, processed orders, dan income summary Seller.
- **FR-091** Menampilkan discount, delivery fee, PPN 12%, dan final total pada detail transaksi.

### L. Delivery & Driver (Level 5)
- **FR-092** Resource delivery/delivery job.
- **FR-093** Endpoint & UI Driver untuk menemukan job tersedia.
- **FR-094** Endpoint & UI Driver untuk melihat detail job.
- **FR-095** Hanya menampilkan job yang siap diambil (status order **Menunggu Pengirim**).
- **FR-096** Aksi take job untuk Driver; memindahkan status order ke **Sedang Dikirim**.
- **FR-097** Aksi confirm completed untuk Driver; memindahkan status order ke **Pesanan Selesai**.
- **FR-098** Menyimpan setiap perubahan status dengan timestamp.
- **FR-099** Buyer dan Seller dapat melacak status pengiriman dengan jelas.
- **FR-100** Dashboard Driver menampilkan active job, job history, dan earnings.
- **FR-101** Menghitung dan menampilkan earning Driver untuk job selesai berdasarkan aturan terdokumentasi.

### M. Admin Monitoring (Level 6)
- **FR-102** Dashboard Admin menampilkan monitoring users.
- **FR-103** Monitoring stores.
- **FR-104** Monitoring products.
- **FR-105** Monitoring orders.
- **FR-106** Monitoring vouchers & promos.
- **FR-107** Monitoring delivery jobs.
- **FR-108** Monitoring overdue orders.

### N. Overdue Auto Return/Refund & Simulasi Waktu (Level 6)
- **FR-109** Mendefinisikan aturan SLA delivery untuk Instant, Next Day, Regular.
- **FR-110** Mengimplementasikan auto refund atau auto return untuk order overdue, mempertimbangkan delivery method.
- **FR-111** Memindahkan order overdue ke status final yang jelas, minimal **Dikembalikan**.
- **FR-112** Menerapkan perubahan finansial dan stock saat order overdue di-refund/return.
- **FR-113** Menyimpan perubahan status terkait overdue dengan timestamp.
- **FR-114** Menampilkan hasil overdue/auto-return/auto-refund di UI.
- **FR-115** Menyediakan mekanisme simulasi "next day"/maju waktu (scheduler, cron, worker, command, atau trigger manual Admin).
- **FR-116** Mengembalikan dana refund ke wallet Buyer dan mencatatnya di riwayat transaksi wallet.
- **FR-117** Tidak menghitung order refund/return sebagai income Seller; jika sudah tercatat, buat reversal/penyesuaian yang jelas.
- **FR-118** Memulihkan stock produk sesuai kuantitas item order yang di-refund/return (kecuali aturan lain didokumentasikan).
- **FR-119** Mencegah double refund, double income reversal, dan double stock restoration untuk order yang sama.

### O. Security Hardening & Dokumentasi Final (Level 7)
- **FR-120** Mencegah SQL Injection (parameterized query / ORM-safe / metode akses DB aman).
- **FR-121** Mencegah XSS dengan escape/sanitasi konten user sebelum render, termasuk komentar application review.
- **FR-122** Memvalidasi field wajib sebelum simpan: email, nomor telepon, rating, quantity, price, stock, nilai discount.
- **FR-123** Menolak input invalid/berbahaya dengan pesan error jelas.
- **FR-124** Menyediakan dokumentasi API (Swagger/OpenAPI, Postman, atau format jelas lain).
- **FR-125** Menyediakan seed data / akun demo untuk Admin, Seller, Buyer, Driver.
- **FR-126** Mendokumentasikan single-store checkout di README.
- **FR-127** Mendokumentasikan aturan kombinasi diskon dan aturan perhitungan PPN 12%.
- **FR-128** Mendokumentasikan aturan earning Driver.
- **FR-129** Mendokumentasikan SLA overdue dan cara simulasi waktu.
- **FR-130** Mendokumentasikan langkah keamanan (SQLi, XSS, validasi input, perilaku sesi, RBAC).
- **FR-131** Menyediakan panduan testing singkat untuk demo end-to-end.
- **FR-132** Riwayat commit step-by-step (tidak di-squash menjadi satu commit).
- **FR-133** Repository publik dan dapat dijalankan di mesin mana pun (README setup + env vars).

---

## 3. Non Functional Requirements

- **NFR-001 (Security - Auth)** Password disimpan ter-hash; autentikasi via token/JWT/session; logout meng-invalidasi sesi; masa berlaku token/sesi wajar dan terdokumentasi.
- **NFR-002 (Security - RBAC)** Otorisasi diverifikasi server-side berdasarkan active role; backend tidak mempercayai role hanya karena muncul di UI; admin-only tidak dapat diakses non-admin; user tidak dapat mengakses resource user lain.
- **NFR-003 (Security - Input)** Seluruh input publik (review, search, login, form checkout, resource admin) aman dari SQL Injection dan XSS; validasi field wajib diterapkan.
- **NFR-004 (Performance - Concurrency)** Operasi sensitif konkuren ditangani aman: pengurangan stock tidak boleh menghasilkan stock negatif; satu order hanya boleh diambil satu Driver (no double-take).
- **NFR-005 (Maintainability)** Kode bersih, struktur proyek terorganisir, komponen UI reusable, separation of concerns yang jelas pada API backend.
- **NFR-006 (Scalability)** Desain mendukung penambahan level/fitur secara progresif; struktur routing & data siap berkembang.
- **NFR-007 (Deployment / Portability)** Proyek dapat dijalankan di mesin mana pun; README memuat setup dan env vars; deployment publik bersifat bonus dan didokumentasikan jika ada.
- **NFR-008 (API)** Backend berbasis API yang mendukung seluruh business flow; desain API bersih.
- **NFR-009 (Dokumentasi)** README detail + dokumentasi API (Swagger/OpenAPI/Postman) + security notes + testing guide; semua keputusan business rule terdokumentasi.
- **NFR-010 (Usability / Responsiveness)** Layout responsif dan usable di ukuran layar umum (desktop & mobile); membedakan tampilan guest vs logged-in.
- **NFR-011 (Auditability)** Sistem tidak boleh mengubah order secara diam-diam; setiap perubahan status meninggalkan jejak (status history bertimestamp).
- **NFR-012 (Consistency)** Business rule diterapkan konsisten di frontend dan backend; istilah & status order konsisten di seluruh aplikasi.

---

## 4. Business Rules

Definisi final, terkonsolidasi dari Level 1-7. Setiap rule memiliki satu definisi.

- **BR-ROLE-01 Multi-Role Ownership:** Satu username non-admin dapat memiliki >1 role (Buyer/Seller/Driver) sekaligus. Admin dikelola terpisah dari mekanisme multi-role non-admin dan harus didokumentasikan.
- **BR-ROLE-02 Active Role:** User dengan >1 role non-admin wajib memilih active role per sesi sebelum diarahkan ke dashboard privat. Otorisasi mengikuti active role, bukan seluruh daftar role. Active role wajib terlihat jelas di UI dan diverifikasi server-side.
- **BR-GUEST-01 Guest Access:** Guest hanya boleh browsing katalog & detail produk dan baca/submit application review. Guest tidak boleh checkout atau mengakses dashboard privat, dan tidak ditampilkan aksi privat (checkout, manajemen produk, manajemen job).
- **BR-REVIEW-01 Application Review:** Application review menilai pengalaman website/aplikasi, bukan produk/order. Dapat disubmit tanpa checkout/transaksi. Field: nama, rating 1-5, komentar. Komentar dirender sebagai teks aman (sanitasi/escape penuh diuji di Level 7).
- **BR-STORE-01 Unique Store Name:** Nama store harus unik (ditegakkan via constraint DB, validasi backend, atau keduanya). Seller hanya boleh mengelola store miliknya sendiri.
- **BR-PRODUCT-01 Product Ownership:** Seller hanya boleh membuat produk di store miliknya dan hanya boleh update/delete produk miliknya. Stock wajib disimpan untuk dipakai saat checkout.
- **BR-WALLET-01 Wallet:** Hanya user dengan active role Buyer yang mengakses wallet & address. Wallet dapat dipakai checkout. Top-up boleh simulasi dummy, tetapi saldo & riwayat transaksi wajib tersimpan dan akurat. Refund dikembalikan ke wallet dan tercatat di riwayat.
- **BR-CART-01 Single-Store Checkout:** Satu cart hanya boleh berisi produk dari satu store. Menambah produk dari store lain harus dicegah atau diminta clear cart dulu. Wajib dijelaskan di UI, diterapkan konsisten di backend, dan didokumentasikan di README.
- **BR-CHECKOUT-01 Tax & Total:** Checkout menghitung subtotal, discount, delivery fee, PPN 12%, dan final total, semuanya tampil di ringkasan. PPN ditampilkan 12%. (Lihat DL-PPN untuk basis & urutan perhitungan.)
- **BR-CHECKOUT-02 Insufficient Balance:** Buyer tidak dapat checkout jika saldo wallet tidak cukup.
- **BR-CHECKOUT-03 Delivery Fee:** Delivery fee berbeda untuk Instant, Next Day, Regular.
- **BR-CHECKOUT-04 Stock Safety:** Setelah checkout berhasil, stock dikurangi aman; stock tidak boleh negatif.
- **BR-VOUCHER-01 Voucher:** Voucher punya expiry date dan remaining usage. Voucher kedaluwarsa atau tanpa sisa usage tidak dapat dipakai.
- **BR-PROMO-01 Promo:** Promo punya expiry date. Promo kedaluwarsa tidak dapat dipakai. Voucher dan Promo harus dibedakan jelas pada validasi/ringkasan.
- **BR-DISCOUNT-01 Combination:** Aturan kombinasi Voucher+Promo harus jelas dan konsisten. (Lihat DL-COMBO.)
- **BR-ORDER-01 Lifecycle:** Status utama order yang wajib selalu terlihat di alur user: **Sedang Dikemas -> Menunggu Pengirim -> Sedang Dikirim -> Pesanan Selesai**, serta status terminal **Dikembalikan**. Status internal tambahan diperbolehkan tetapi status utama tidak boleh hilang dari UI. Status awal setelah checkout: Sedang Dikemas.
- **BR-ORDER-02 Seller Processing Gate:** Seller harus memproses order (Sedang Dikemas -> Menunggu Pengirim) sebelum job tersedia untuk Driver. Hanya Seller pemilik order yang boleh memproses.
- **BR-DELIVERY-01 Job Eligibility:** Driver hanya boleh mengambil job berstatus Menunggu Pengirim; tidak boleh melihat/mengambil order yang masih Sedang Dikemas. Job terhubung ke order spesifik.
- **BR-DELIVERY-02 Single Active Driver:** Satu order hanya boleh punya satu Driver aktif; Driver tidak boleh mengambil job yang sudah diambil Driver lain. Take job memindahkan status ke Sedang Dikirim; confirm completed memindahkan ke Pesanan Selesai. Setiap perubahan disimpan dengan timestamp dan dapat dilacak Buyer & Seller.
- **BR-EARNING-01 Driver Earning:** Earning Driver dihitung dengan aturan terdokumentasi (dari delivery fee atau aturan lain) dan diterapkan konsisten. (Lihat DL-EARNING.)
- **BR-STATUS-01 Status History:** Setiap perubahan status order disimpan dengan timestamp. Sistem tidak boleh mengubah order secara diam-diam tanpa jejak.
- **BR-OVERDUE-01 SLA:** Terdapat SLA delivery untuk Instant, Next Day, Regular. (Lihat DL-SLA.) Overdue handling mempertimbangkan delivery method yang dipilih.
- **BR-REFUND-01 Refund Eligibility:** Refund hanya untuk order yang sudah berhasil checkout & dibayar Buyer.
- **BR-REFUND-02 Refund Effects:** Saat order overdue eligible di-refund/return: dana kembali ke wallet Buyer + tercatat di riwayat; income Seller tidak dihitung (atau di-reversal bila sudah tercatat); stock dipulihkan sesuai kuantitas item; order pindah ke status final minimal Dikembalikan; perubahan tercatat dengan timestamp dan terlihat di UI.
- **BR-REFUND-03 Idempotency:** Sistem mencegah double refund, double income reversal, dan double stock restoration untuk order yang sama.
- **BR-SIM-01 Time Simulation:** Sistem menyediakan cara mensimulasikan next day / maju waktu (scheduler, cron, worker, command, atau trigger manual Admin) untuk keperluan demo overdue.
- **BR-SEC-01 Server-Side Authorization:** Backend menegakkan otorisasi sebenarnya; FE hanya membantu. Admin-only tidak dapat diakses non-admin; user tidak dapat mengakses/memodifikasi resource user lain; aksi hanya yang diizinkan active role saat ini.
- **BR-SEC-02 Safe Input:** Input user wajib aman dari SQL Injection dan XSS; field wajib divalidasi; input berbahaya ditolak dengan pesan jelas.
- **BR-LEVEL-01 Assessment Scope:** Submission klaim Level N dinilai dari Level 1 sampai N saja. Fitur level lebih tinggi tidak wajib untuk membuktikan kelengkapan level bawah; placeholder/seed/setup terdokumentasi diterima sampai level terkait dicapai. Bonus hanya eligible jika minimal Level 1 selesai.

---

## 5. Decision Log

Setiap titik yang memberi kebebasan implementasi memiliki keputusan final. Bila tidak dapat dipastikan, dipindahkan ke Open Issue.

| ID | Lokasi (Level) | Kalimat Asli (ringkas) | Keputusan Final | Alasan | Dampak Sistem |
|----|----------------|------------------------|-----------------|--------|---------------|
| DL-CLIENT | Pendahuluan | "The client may be implemented as either a web app or a mobile app." | Klien dibangun sebagai **web app responsive**. | Lebih cepat menampilkan multi-role dashboard & memenuhi bonus UI responsif. | Menentukan stack FE; navigasi responsif desktop+mobile. |
| DL-PPN | L3/L4 | "PPN must be shown as 12%... If your tax base differs, explain it." | PPN 12% dihitung dari **(subtotal - discount)**; delivery fee tidak dikenakan PPN. Urutan: subtotal -> kurangi discount -> hitung PPN 12% atas hasilnya -> tambah delivery fee = final total. | Konsisten dengan praktik pajak atas nilai barang setelah diskon. | final_total = (subtotal - discount) + PPN12% + delivery_fee. Wajib didokumentasikan di README (FR-127). |
| DL-COMBO | L4 | "You may decide whether Voucher and Promo can be combined." | Voucher dan Promo **boleh dikombinasikan** dalam satu checkout. Promo diterapkan lebih dulu, lalu Voucher; keduanya mengurangi subtotal sebelum PPN. Maksimal 1 voucher + 1 promo per order. | Memberi nilai diskon jelas tanpa ambiguitas stacking ganda. | Validasi checkout menerima maksimal satu kode tiap tipe; ringkasan membedakan kontribusi Voucher vs Promo. |
| DL-EARNING | L5 | "Define how Driver earning is calculated... a simple earning rule." | Driver earning = **80% dari delivery fee** order yang selesai (Pesanan Selesai). | Aturan sederhana, dapat diuji, terikat langsung ke delivery fee. | Earning tercatat saat status Pesanan Selesai; ditampilkan di dashboard Driver. Didokumentasikan (FR-128). |
| DL-SLA | L6 | "Define delivery SLA rules for Instant, Next Day, and Regular." | SLA dalam **simulated day** sejak status Menunggu Pengirim: Instant = 0 hari (jatuh tempo hari yang sama), Next Day = 1 hari, Regular = 3 hari. Lewat batas tanpa Pesanan Selesai = overdue. | Selaras dengan mekanisme simulasi next-day untuk demo. | FR-109/FR-110; menentukan kapan order overdue. Didokumentasikan (FR-129). |
| DL-OVERDUE-ACTION | L6 | "auto refund or auto return for overdue orders based on delivery method." | Semua delivery method overdue menjalankan **auto refund** (dana balik ke wallet) dan status menjadi **Dikembalikan**; stock dipulihkan. | Satu mekanisme final konsisten, memenuhi minimal status Dikembalikan & efek finansial. | Implementasi tunggal yang idempotent (BR-REFUND-03). |
| DL-SIM-METHOD | Core BR / L6 | "simulate the next day... scheduler, cron, worker, command, or manual Admin trigger." | Menggunakan **manual Admin trigger** ("Advance Day") yang memajukan simulated date +1 dan mengevaluasi overdue. | Paling mudah didemokan evaluator tanpa menunggu waktu nyata. | Endpoint/aksi Admin khusus; mempengaruhi evaluasi SLA. |
| DL-REVIEW-AUTH | L1 | "Guests may submit application reviews unless your implementation explicitly requires login." | Application review **boleh disubmit Guest tanpa login**. | Memenuhi tujuan early feedback & sesuai default challenge. | Endpoint review publik; tetap disanitasi (Level 7). |
| DL-REVIEW-STORE | L1 | "review may be stored in frontend state, local storage, or a backend resource." | Application review disimpan sebagai **backend resource**. | Konsisten dengan kebutuhan keamanan & monitoring; data persisten untuk demo. | Memerlukan tabel/endpoint review; disanitasi server-side. |
| DL-STORE-UNIQUE | L2 | "enforced either through database constraints, backend validation, or both." | Keunikan nama store ditegakkan via **database constraint + validasi backend**. | Pertahanan ganda, mencegah race condition. | Constraint unik + pengecekan sebelum simpan. |
| DL-CART-CONFLICT | L3 | "prevent it or clearly ask the buyer to clear the cart first." | Saat menambah produk dari store berbeda, sistem **menolak** dengan pesan jelas dan menawarkan opsi clear cart. | Perilaku eksplisit, mudah diuji. | Endpoint add-to-cart memvalidasi store; UI menampilkan prompt. |
| DL-STOCK-RESTORE | L6 | "Product stock must be restored... unless a different stock handling rule is clearly documented." | Stock **dipulihkan penuh** sesuai kuantitas item saat refund/return. | Default paling adil & sesuai aturan. | Restorasi stock idempotent saat overdue. |
| DL-TOPUP | L3 | "The top-up flow may be a dummy simulation." | Top-up adalah **simulasi dummy** (langsung menambah saldo tanpa payment gateway nyata). | Sesuai scope challenge. | Endpoint top-up menambah saldo + catat riwayat. |
| DL-INTERNAL-STATUS | Order Lifecycle | "Additional internal statuses are allowed if needed." | Tidak menambah status internal tambahan; hanya 5 status utama digunakan. | Menyederhanakan & menjaga konsistensi UI. | State machine order terbatas pada status utama. |

---

## 6. Acceptance Criteria

Setiap FR punya kriteria yang dapat diuji.

**FR-001** • [ ] Home page tampil. • [ ] Menampilkan banyak toko atau bahasa marketplace. • [ ] Dapat diakses tanpa login.
**FR-002** • [ ] Listing produk tampil bagi Guest. • [ ] Tidak perlu login.
**FR-003** • [ ] Detail produk read-only tampil. • [ ] Tidak ada aksi edit/checkout untuk Guest.
**FR-004** • [ ] Halaman login tersedia. • [ ] Halaman register tersedia.
**FR-005** • [ ] Komponen Button/Input/Card/Navbar/Footer dipakai ulang di >1 halaman.
**FR-006** • [ ] Ada route publik. • [ ] Ada route privat terpisah.
**FR-007** • [ ] Shell dashboard Admin/Seller/Buyer/Driver dapat dibuka sesuai role.
**FR-008** • [ ] Layout benar di desktop. • [ ] Layout benar di mobile.
**FR-009** • [ ] Navigasi Guest berbeda dari navigasi logged-in.
**FR-010** • [ ] User dapat register. • [ ] Data tersimpan.
**FR-011** • [ ] Login berhasil dengan kredensial valid. • [ ] Logout mengakhiri sesi.
**FR-012** • [ ] Password tidak plaintext. • [ ] Hash terverifikasi saat login.
**FR-013** • [ ] Request terproteksi memerlukan token/session valid.
**FR-014** • [ ] Model mendukung 4 role.
**FR-015** • [ ] Satu username dapat memiliki Buyer+Seller+Driver.
**FR-016** • [ ] Endpoint mengembalikan daftar role user.
**FR-017** • [ ] User dapat memilih active role. • [ ] Active role tersimpan di sesi.
**FR-018** • [ ] User multi-role melihat halaman/modal pemilihan role. • [ ] User single-role tidak dipaksa memilih.
**FR-019** • [ ] Akses route/endpoint privat ditolak jika active role tidak sesuai.
**FR-020** • [ ] Endpoint profil mengembalikan user yang login.
**FR-021** • [ ] Halaman profil menampilkan daftar role + active role.
**FR-022** • [ ] Active role terlihat jelas di UI.
**FR-023** • [ ] Placeholder ringkasan finansial lintas role tampil.
**FR-024** • [ ] Setelah logout, token/sesi lama ditolak.
**FR-025** • [ ] User A tidak dapat mengakses/mengubah resource user B.
**FR-026** • [ ] Non-admin ditolak saat akses endpoint/halaman admin.
**FR-027** • [ ] Token/sesi kedaluwarsa sesuai aturan terdokumentasi.
**FR-028** • [ ] Section review publik tampil.
**FR-029** • [ ] Form submit review tersedia di halaman publik.
**FR-030** • [ ] Form punya field nama, rating 1-5, komentar. • [ ] Rating di luar 1-5 ditolak.
**FR-031** • [ ] Review yang disubmit tampil di list/carousel.
**FR-032** • [ ] Review dapat dibuat tanpa checkout/transaksi.
**FR-033** • [ ] Komentar tampil sebagai teks. • [ ] Komentar tidak merusak layout.
**FR-034** • [ ] Resource store ada.
**FR-035** • [ ] Seller dapat create/update profil store.
**FR-036** • [ ] Field nama store ada.
**FR-037** • [ ] Nama store duplikat ditolak dengan error.
**FR-038** • [ ] Ringkasan store publik dapat diakses.
**FR-039** • [ ] Produk punya nama, deskripsi, harga, stock, pemilik store.
**FR-040** • [ ] Seller dapat membuat produk di store sendiri.
**FR-041** • [ ] Seller dapat update produk sendiri.
**FR-042** • [ ] Seller dapat delete produk sendiri.
**FR-043** • [ ] Dashboard Seller hanya menampilkan produk miliknya.
**FR-044** • [ ] Endpoint publik mengembalikan daftar produk dari data backend.
**FR-045** • [ ] Endpoint publik mengembalikan detail produk.
**FR-046** • [ ] Info store tampil di listing/detail produk.
**FR-047** • [ ] Halaman/blok detail store tersedia.
**FR-048** • [ ] Resource wallet Buyer ada.
**FR-049** • [ ] Top-up dummy menambah saldo.
**FR-050** • [ ] Riwayat transaksi wallet tersimpan & tampil.
**FR-051** • [ ] Buyer dapat menambah/ubah/hapus alamat.
**FR-052** • [ ] Saldo & riwayat top-up tampil di dashboard Buyer.
**FR-053** • [ ] Buyer dapat menambah produk ke cart.
**FR-054** • [ ] Kuantitas item cart dapat diubah.
**FR-055** • [ ] Item dapat dihapus dari cart.
**FR-056** • [ ] Ringkasan cart tampil via endpoint & UI.
**FR-057** • [ ] Menambah produk store berbeda ditolak/diminta clear cart.
**FR-058** • [ ] Endpoint checkout membuat order.
**FR-059** • [ ] Tiga delivery method dapat dipilih.
**FR-060** • [ ] Subtotal, discount, delivery fee, PPN 12%, final total dihitung benar.
**FR-061** • [ ] Ringkasan checkout menampilkan semua komponen sebelum konfirmasi.
**FR-062** • [ ] Order dibuat hanya dari satu store.
**FR-063** • [ ] Stock berkurang setelah checkout. • [ ] Stock tidak pernah negatif.
**FR-064** • [ ] Buyer melihat order history & detail.
**FR-065** • [ ] Seller melihat daftar incoming order.
**FR-066** • [ ] Status history tersimpan dengan timestamp.
**FR-067** • [ ] Delivery fee berbeda per method.
**FR-068** • [ ] Status awal order = Sedang Dikemas.
**FR-069** • [ ] Resource Voucher ada.
**FR-070** • [ ] Resource Promo ada.
**FR-071** • [ ] Admin dapat generate voucher & promo via endpoint.
**FR-072** • [ ] List & detail voucher/promo tersedia.
**FR-073** • [ ] Voucher punya expiry & remaining usage.
**FR-074** • [ ] Promo punya expiry.
**FR-075** • [ ] Checkout menerima kode diskon.
**FR-076** • [ ] Kode invalid/kedaluwarsa/habis ditolak. • [ ] Kode valid diterima.
**FR-077** • [ ] Efek diskon tampil. • [ ] Voucher vs Promo dibedakan di ringkasan.
**FR-078** • [ ] UI Admin generate voucher berfungsi.
**FR-079** • [ ] UI Admin generate promo berfungsi.
**FR-080** • [ ] UI Admin list & detail voucher tampil.
**FR-081** • [ ] UI Admin list & detail promo tampil.
**FR-082** • [ ] Expiry & info usage tampil di UI Admin.
**FR-083** • [ ] Seller dapat memproses incoming order.
**FR-084** • [ ] Status pindah Sedang Dikemas -> Menunggu Pengirim.
**FR-085** • [ ] Perubahan tercatat di status history bertimestamp.
**FR-086** • [ ] Timeline status tampil di halaman Buyer & Seller.
**FR-087** • [ ] Laporan pengeluaran Buyer tampil.
**FR-088** • [ ] Laporan income Seller tampil.
**FR-089** • [ ] Buyer melihat history, detail, status history bertimestamp.
**FR-090** • [ ] Seller melihat incoming, processed, income summary.
**FR-091** • [ ] Discount, delivery fee, PPN 12%, final total tampil di detail transaksi.
**FR-092** • [ ] Resource delivery job ada.
**FR-093** • [ ] Driver melihat daftar job tersedia.
**FR-094** • [ ] Driver melihat detail job.
**FR-095** • [ ] Hanya order Menunggu Pengirim yang tampil sebagai job.
**FR-096** • [ ] Take job memindahkan status ke Sedang Dikirim.
**FR-097** • [ ] Confirm completed memindahkan status ke Pesanan Selesai.
**FR-098** • [ ] Setiap perubahan status tersimpan bertimestamp.
**FR-099** • [ ] Buyer & Seller dapat melacak progres pengiriman.
**FR-100** • [ ] Dashboard Driver menampilkan active job, history, earnings.
**FR-101** • [ ] Earning dihitung sesuai aturan (80% delivery fee) untuk job selesai.
**FR-102** • [ ] Admin melihat monitoring users.
**FR-103** • [ ] Admin melihat monitoring stores.
**FR-104** • [ ] Admin melihat monitoring products.
**FR-105** • [ ] Admin melihat monitoring orders.
**FR-106** • [ ] Admin melihat monitoring vouchers & promos.
**FR-107** • [ ] Admin melihat monitoring delivery jobs.
**FR-108** • [ ] Admin melihat monitoring overdue orders.
**FR-109** • [ ] SLA Instant/Next Day/Regular terdefinisi & diterapkan.
**FR-110** • [ ] Order overdue otomatis diproses refund/return sesuai method.
**FR-111** • [ ] Order overdue berpindah ke status minimal Dikembalikan.
**FR-112** • [ ] Perubahan finansial & stock diterapkan saat refund/return.
**FR-113** • [ ] Perubahan status overdue tersimpan bertimestamp.
**FR-114** • [ ] Hasil overdue/refund/return tampil di UI.
**FR-115** • [ ] Tersedia trigger simulasi next day.
**FR-116** • [ ] Dana refund kembali ke wallet & tercatat di riwayat.
**FR-117** • [ ] Income Seller tidak menghitung order refund (atau di-reversal).
**FR-118** • [ ] Stock dipulihkan sesuai kuantitas item.
**FR-119** • [ ] Refund/reversal/restorasi ganda dicegah untuk order sama.
**FR-120** • [ ] Payload SQL-like tidak mengubah struktur/perilaku query.
**FR-121** • [ ] Tag script di komentar review tidak tereksekusi.
**FR-122** • [ ] Field wajib (email, telepon, rating, quantity, price, stock, discount) divalidasi.
**FR-123** • [ ] Input invalid ditolak dengan pesan jelas.
**FR-124** • [ ] Dokumentasi API tersedia (Swagger/OpenAPI/Postman).
**FR-125** • [ ] Seed/akun demo untuk 4 role tersedia.
**FR-126** • [ ] Single-store checkout terdokumentasi di README.
**FR-127** • [ ] Aturan kombinasi diskon & PPN 12% terdokumentasi.
**FR-128** • [ ] Aturan earning Driver terdokumentasi.
**FR-129** • [ ] SLA overdue & cara simulasi waktu terdokumentasi.
**FR-130** • [ ] Security notes (SQLi, XSS, validasi, sesi, RBAC) terdokumentasi.
**FR-131** • [ ] Panduan testing demo end-to-end tersedia.
**FR-132** • [ ] Commit history step-by-step (tidak single squash).
**FR-133** • [ ] Repo publik & dapat dijalankan dengan README + env vars.

---

## 7. Domain Glossary

- **Guest:** Pengunjung tanpa akun; hanya browsing katalog/detail produk dan application review.
- **Buyer:** Role yang mengelola wallet, address, cart, checkout, order history, laporan pengeluaran.
- **Seller:** Role yang membuat store, mengelola produk, memproses order, melihat income.
- **Driver:** Role yang mencari job, mengambil job, menyelesaikan job, melihat earning.
- **Admin:** Role istimewa yang memonitor marketplace, mengelola voucher/promo, memicu aksi operasional, mengakses halaman admin-only.
- **Active Role:** Role yang sedang dipakai pada sesi saat ini; dasar otorisasi.
- **Store:** Identitas publik Seller; nama unik.
- **Product:** Barang milik store dengan nama, deskripsi, harga, stock.
- **Catalog:** Kumpulan produk publik dari berbagai store.
- **Application Review:** Ulasan tentang pengalaman aplikasi/website (bukan produk/order); berisi nama, rating 1-5, komentar.
- **Wallet:** Saldo Buyer untuk membayar checkout; punya riwayat transaksi.
- **Top-up:** Penambahan saldo wallet (simulasi dummy).
- **Delivery Address:** Alamat pengiriman milik Buyer.
- **Cart:** Keranjang Buyer; hanya berisi produk dari satu store (single-store).
- **Single-Store Checkout:** Aturan satu cart hanya berisi produk dari satu store.
- **Delivery Method:** Pilihan pengiriman: Instant, Next Day, Regular; mempengaruhi delivery fee & SLA.
- **Delivery Fee:** Biaya kirim berdasarkan delivery method.
- **Subtotal:** Total harga produk sebelum diskon, pajak, dan ongkir.
- **Discount:** Pengurang dari Voucher dan/atau Promo.
- **Voucher:** Diskon dengan expiry date dan remaining usage.
- **Promo:** Diskon dengan expiry date (tanpa kuota usage individual).
- **PPN 12%:** Pajak 12% dihitung atas (subtotal - discount) (lihat DL-PPN).
- **Final Total:** Jumlah akhir yang dibayar Buyer = (subtotal - discount) + PPN 12% + delivery fee.
- **Order:** Hasil checkout; punya status & status history.
- **Order Lifecycle:** Sedang Dikemas -> Menunggu Pengirim -> Sedang Dikirim -> Pesanan Selesai; status terminal Dikembalikan.
- **Status History:** Catatan setiap perubahan status order beserta timestamp.
- **Delivery Job:** Pekerjaan pengiriman terhubung ke satu order; tersedia saat order Menunggu Pengirim.
- **Take Job:** Aksi Driver mengambil delivery job (-> Sedang Dikirim).
- **Confirm Completed:** Aksi Driver menyelesaikan job (-> Pesanan Selesai).
- **Driver Earning:** Pendapatan Driver dari job selesai (80% delivery fee, lihat DL-EARNING).
- **Seller Income:** Pendapatan Seller dari order; dikoreksi bila terjadi refund/return.
- **SLA:** Batas waktu pengiriman per delivery method (lihat DL-SLA).
- **Overdue Order:** Order yang melewati SLA tanpa selesai.
- **Auto Refund / Auto Return:** Proses otomatis untuk order overdue: dana balik ke wallet, stock dipulihkan, status -> Dikembalikan.
- **Reversal:** Pembalikan income Seller yang sudah tercatat akibat refund/return.
- **Time Simulation (Next Day):** Mekanisme memajukan waktu untuk demo overdue (manual Admin trigger, lihat DL-SIM-METHOD).
- **RBAC:** Role-Based Access Control; otorisasi berdasarkan active role, ditegakkan server-side.

---

## 8. Traceability Matrix

| Requirement | Business Rule | Role | Module |
|-------------|---------------|------|--------|
| FR-001..FR-003 | BR-GUEST-01 | Guest | Public Marketplace |
| FR-004, FR-010..FR-013 | BR-SEC-01, BR-SEC-02 | All | Authentication |
| FR-014..FR-018, FR-022 | BR-ROLE-01, BR-ROLE-02 | Buyer/Seller/Driver | Auth / Role Awareness |
| FR-019, FR-024..FR-027 | BR-ROLE-02, BR-SEC-01 | All | Security / RBAC |
| FR-020, FR-021, FR-023 | BR-ROLE-02 | All | Profile / Dashboard |
| FR-005..FR-009 | NFR-005, NFR-010 | All | UI Foundation |
| FR-028..FR-033 | BR-REVIEW-01, BR-SEC-02 | Guest/All | Application Reviews |
| FR-034..FR-038 | BR-STORE-01 | Seller | Store Management |
| FR-039..FR-043 | BR-PRODUCT-01 | Seller | Product Management |
| FR-044..FR-047 | BR-GUEST-01 | Guest/Seller | Public Catalog |
| FR-048..FR-052 | BR-WALLET-01 | Buyer | Wallet & Address |
| FR-053..FR-057 | BR-CART-01 | Buyer | Cart |
| FR-058..FR-068 | BR-CHECKOUT-01..04, BR-ORDER-01, BR-STATUS-01 | Buyer/Seller | Checkout & Orders |
| FR-069..FR-082 | BR-VOUCHER-01, BR-PROMO-01, BR-DISCOUNT-01 | Admin/Buyer | Discounts |
| FR-083..FR-086 | BR-ORDER-02, BR-STATUS-01 | Seller | Order Processing |
| FR-087..FR-091 | BR-CHECKOUT-01, BR-REFUND-02 | Buyer/Seller | Reports |
| FR-092..FR-095 | BR-DELIVERY-01 | Driver | Delivery Jobs |
| FR-096..FR-099 | BR-DELIVERY-02, BR-ORDER-01, BR-STATUS-01 | Driver/Buyer/Seller | Delivery Workflow |
| FR-100, FR-101 | BR-EARNING-01 | Driver | Driver Earnings |
| FR-102..FR-108 | BR-SEC-01 | Admin | Admin Monitoring |
| FR-109..FR-119 | BR-OVERDUE-01, BR-REFUND-01..03, BR-SIM-01 | Admin/System | Overdue Handling |
| FR-115 | BR-SIM-01 | Admin | Time Simulation |
| FR-120..FR-123 | BR-SEC-02 | All | Input Security |
| FR-124..FR-131 | NFR-009 | All | Documentation |
| FR-132, FR-133 | NFR-007 | All | Delivery / Repo |

---

## 9. Asumsi

- **A-01** Klien diimplementasikan sebagai web app responsive (DL-CLIENT).
- **A-02** "Simulated day" adalah unit waktu logis yang dikendalikan trigger Admin, bukan waktu sistem nyata (DL-SIM-METHOD, DL-SLA).
- **A-03** PPN dihitung atas (subtotal - discount); delivery fee bebas PPN (DL-PPN).
- **A-04** Maksimal satu Voucher dan satu Promo per checkout, keduanya boleh digabung (DL-COMBO).
- **A-05** Driver earning = 80% delivery fee per job selesai (DL-EARNING).
- **A-06** Semua delivery method overdue menjalankan auto refund + status Dikembalikan (DL-OVERDUE-ACTION).
- **A-07** Application review disimpan di backend dan boleh dibuat Guest (DL-REVIEW-AUTH, DL-REVIEW-STORE).
- **A-08** Admin dibuat melalui seed data/setup terdokumentasi, bukan registrasi publik.
- **A-09** Stock dipulihkan penuh saat refund/return (DL-STOCK-RESTORE).
- **A-10** Top-up adalah simulasi dummy tanpa payment gateway nyata (DL-TOPUP).
- **A-11** Mata uang tunggal (IDR) untuk seluruh nilai finansial; PPN dibulatkan ke bilangan bulat terdekat.
- **A-12** Satu order berasal dari satu store (konsekuensi single-store), sehingga income Seller per order tidak terbagi antar store.

---

## 10. Open Issue

- **OI-01 Granularitas waktu SLA Instant.**
  - *Permasalahan:* Mekanisme simulasi berbasis hari (next day). SLA Instant idealnya berbasis jam/menit, tetapi simulasi per hari membuat Instant praktis jatuh tempo pada hari yang sama.
  - *Rekomendasi:* Perlakukan Instant sebagai jatuh tempo pada simulated day yang sama (overdue jika belum selesai saat hari dimajukan). Bila evaluator menuntut presisi jam, tambahkan simulasi berbasis jam.
  - *Alasan:* Menjaga konsistensi dengan trigger "Advance Day" tanpa menambah kompleksitas, sambil mencatat batasannya.
- **OI-02 Titik pencatatan Seller income.**
  - *Permasalahan:* Sumber tidak menyatakan kapan income Seller "tercatat" (saat checkout, diproses, atau Pesanan Selesai), yang memengaruhi kapan reversal diperlukan.
  - *Rekomendasi:* Catat income Seller saat order mencapai Pesanan Selesai; karena overdue terjadi sebelum selesai, reversal umumnya tidak diperlukan, namun mekanisme reversal tetap disediakan untuk memenuhi BR-REFUND-02.
  - *Alasan:* Mengurangi kebutuhan reversal sekaligus tetap memenuhi aturan, tanpa menetapkan diam-diam.
- **OI-03 Mekanisme locking take job.**
  - *Permasalahan:* Wajib satu Driver aktif per order, namun mekanisme penguncian tidak ditentukan.
  - *Rekomendasi:* Gunakan operasi atomik/locking di backend saat take job; detail ditetapkan pada tahap SDD.
  - *Alasan:* Keputusan teknis penguncian di luar scope PRD, sehingga dicatat sebagai isu terbuka untuk tahap desain.
