# Skill: Atomic Conditional Update

## Kapan dipakai
Setiap kali mengimplementasikan update status atau field yang rentan terhadap *race condition* atau *double-processing*, contohnya:
- "Take Job" (Driver mengambil pekerjaan pengiriman, agar dua driver tidak mengambil pesanan yang sama)
- "Process Overdue" (Simulasi waktu maju, agar sebuah pesanan tidak di-refund / dikembalikan 2x)

## Aturan wajib
1. Jangan lakukan logic verifikasi state di dalam memori program (misalnya `SELECT` lalu cek `if status == 'x'` lalu `UPDATE`), karena hal ini rentan race condition.
2. Gunakan query UPDATE kondisional langsung (Optimistic Locking/Atomic Update) dengan penambahan validasi di klausul `WHERE`.
3. Selalu periksa jumlah baris yang terpengaruh (Rows Affected). Jika `Rows Affected == 0`, artinya data sudah diambil, tidak valid, atau sudah berubah sejak pengecekan terakhir. Lempar error `ErrRecordNotFound` atau `ErrConflict` sesuai dengan context.
4. Gunakan transaction (`tx`) bila update ini diikat dengan insert atau logic lain.

## Contoh

```go
func (r *DeliveryRepository) TakeAtomic(tx *gorm.DB, orderID, driverID string) error {
	now := time.Now().UnixMilli()
	// Gunakan UPDATE langsung, dan pastikan target state masih sesuai
	result := tx.Exec(
		`UPDATE deliveries d
		 SET d.driver_id = ?, d.status = 'in_progress', d.taken_at = ?
		 WHERE d.order_id = ? AND d.driver_id IS NULL
		 AND EXISTS (SELECT 1 FROM orders o WHERE o.id = d.order_id AND o.status = 'Menunggu Pengiriman')`,
		driverID, now, orderID,
	)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}
```

## Kesalahan yang harus dihindari
- JANGAN menggunakan `SELECT ...` lalu if state check lalu `UPDATE ...` secara berurutan, walau dalam transaksi tanpa `FOR UPDATE`, ini bukan atomic operation di tingkat query dan akan berujung pada double-take.
- JANGAN abaikan hasil pengecekan `RowsAffected`.
- JANGAN memodifikasi field tanpa memasukkannya ke dalam klausul `WHERE` sebagai guard condition (misalnya pastikan `d.driver_id IS NULL`).
