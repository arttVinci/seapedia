# Skill: Pola CRUD per Modul

## Kapan dipakai
Saat membuat modul data standar (toko, produk, alamat, voucher, promo, dll).
Bukan untuk modul kritis (checkout, ambil pekerjaan, keterlambatan) yang punya
algoritma khusus.

## Berkas per modul (ikuti penamaan ini)
- entity/{modul}_entity.go        -> struct GORM
- model/{modul}_model.go          -> request/response
- model/converter/{modul}_converter.go -> entity <-> response
- repository/{modul}_repository.go -> akses data (manfaatkan Repository[T] generik)
- usecase/{modul}_usecase.go      -> logika bisnis + validasi
- controller/{modul}_controller.go -> handler HTTP
- daftarkan route di route.

## Aturan wajib
- Validasi input pakai go-playground/validator di usecase.
- Operasi tulis dibungkus transaksi GORM (Begin -> defer Rollback -> Commit).
- Selalu cek kepemilikan untuk resource milik pengguna.
- Respons ikut api-response-convention.skill.
- Konversi entity -> response lewat converter, JANGAN kembalikan entity langsung.

## Kesalahan yang harus dihindari
- JANGAN mengembalikan struct entity database langsung ke klien.
- JANGAN menaruh logika bisnis di controller.
- JANGAN melewati validasi input.
