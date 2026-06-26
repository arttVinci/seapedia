# Skill: Mesin Status Pesanan

## Kapan dipakai
Setiap kali mengubah status pesanan, di modul mana pun (checkout, penjual,
pengemudi, keterlambatan).

## Status (hanya 5, tidak boleh menambah)
Sedang Dikemas, Menunggu Pengirim, Sedang Dikirim, Pesanan Selesai, Dikembalikan.

## Transisi sah (di luar ini DITOLAK)
| Dari | Ke | Siapa |
|------|----|----|
| (baru) | Sedang Dikemas | Pembeli (checkout) |
| Sedang Dikemas | Menunggu Pengirim | Penjual pemilik |
| Menunggu Pengirim | Sedang Dikirim | Pengemudi (atomik) |
| Sedang Dikirim | Pesanan Selesai | Pengemudi pengambil |
| Sedang Dikemas / Menunggu Pengirim / Sedang Dikirim | Dikembalikan | Sistem (overdue) |

## Aturan wajib
1. Validasi status SAAT INI sebelum mengubah. Jika transisi tidak ada di tabel,
   tolak dengan error jelas.
2. SETIAP perubahan status menambah satu baris order_status_histories
   (status baru + timestamp). Tidak boleh mengubah status tanpa jejak.
3. Pesanan Selesai dan Dikembalikan adalah status terminal: tidak ada transisi
   keluar.
4. Perubahan status dan efek sampingnya harus dalam SATU transaksi.

## Efek samping wajib per transisi
- -> Sedang Dikemas: kurangi stok (kunci baris), potong dompet, catat
  wallet_transactions(payment), buat baris deliveries.
- -> Sedang Dikirim: isi driver_id (atomik), catat taken_at.
- -> Pesanan Selesai: hitung earning pengemudi (80% delivery_fee), catat
  pendapatan penjual, catat completed_at.
- -> Dikembalikan: refund ke dompet + catat transaksi, pulihkan stok, pendapatan
  penjual tidak dihitung, jaga idempotent.

## Kesalahan yang harus dihindari
- JANGAN melompati status (mis. Sedang Dikemas -> Sedang Dikirim).
- JANGAN mengubah status terminal.
- JANGAN mengubah status tanpa mencatat history.
