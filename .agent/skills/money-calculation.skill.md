# Skill: Perhitungan Uang

## Kapan dipakai
Setiap kali menghitung total terkait pesanan: checkout preview, checkout,
laporan, dan pengembalian dana. WAJIB dipakai, jangan menghitung manual
dengan urutan berbeda.

## Aturan wajib (urutan tidak boleh diubah)
1. subtotal     = jumlah dari (harga_snapshot × kuantitas) tiap item
2. discount     = nominal voucher + nominal promo (keduanya nominal tetap)
3. taxable      = subtotal − discount
4. tax          = 12% × taxable, DIBULATKAN ke bilangan bulat terdekat
5. delivery_fee = sesuai metode (instant/next_day/regular). TIDAK kena PPN.
6. final_total  = taxable + tax + delivery_fee

## Aturan diskon
- Maksimal 1 voucher + 1 promo per pesanan.
- Promo diterapkan lebih dulu, lalu voucher; keduanya mengurangi subtotal
  sebelum PPN.
- discount tidak boleh membuat taxable negatif (batas bawah 0).
- Voucher: cek expired_at DAN remaining_usage > 0.
- Promo: cek expired_at saja.

## Mata uang
- Semua nilai dalam IDR, bilangan bulat. PPN dibulatkan ke bilangan bulat
  terdekat.

## Contoh
subtotal=100000, discount=15000 -> taxable=85000
tax = 12% × 85000 = 10200
delivery_fee (regular) = 10000
final_total = 85000 + 10200 + 10000 = 105200

## Kesalahan yang harus dihindari
- JANGAN menghitung PPN dari subtotal penuh (harus dari taxable).
- JANGAN mengenakan PPN pada delivery_fee.
- JANGAN lupa membulatkan PPN.
- JANGAN menerapkan lebih dari 1 voucher atau 1 promo.
