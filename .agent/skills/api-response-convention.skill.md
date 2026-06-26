# Skill: Konvensi Respons API

## Kapan dipakai
Setiap endpoint backend, tanpa kecuali.

## Format sukses (WebResponse[T])
{
  "data": <isi>,
  "message": "<pesan opsional>",
  "success": true,
  "paging": { "page", "size", "total_item", "total_page" }   // hanya untuk list
}

## Format error (ApiErrorResponse)
{
  "message": "<pesan>",
  "statusCode": <kode>,
  "errors": { "field": ["pesan validasi"] }   // opsional, untuk error validasi
}

## Aturan wajib
- Error dilempar dengan fiber.NewError(kode, pesan); ditangkap ErrorHandler
  global. JANGAN menulis JSON error manual di controller.
- Endpoint list WAJIB mengembализикan paging.
- Kode status sesuai: 200 sukses, 201 dibuat, 400 input salah, 401 belum login,
  403 tidak berhak, 404 tidak ditemukan, 409 konflik (mis. nama toko dipakai).

## Kesalahan yang harus dihindari
- JANGAN membuat format respons berbeda antar modul.
- JANGAN mengembalikan 200 untuk error.
