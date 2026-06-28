# AGENTS.md - Definisi Agen SEAPEDIA

> Dokumen ini mendefinisikan peran, tanggung jawab, dan batas (boundary) tiap
> agen. Tujuannya agar agen tidak saling menimpa pekerjaan (overlap) dan setiap
> bagian sistem punya pemilik yang jelas.
>
> Seluruh agen WAJIB mengikuti dokumen acuan: Software Design Document (SDD),
> System Map, dan berkas di .agent/skills/. Agen adalah eksekutor; keputusan
> arsitektur sudah dikunci di dokumen tersebut dan tidak boleh diubah sepihak.

---

## Prinsip Umum (berlaku untuk semua agen)

- Selalu baca progress.md sebelum mulai dan perbarui setelah selesai.
- Patuh pada boundary kepemilikan di bawah; jangan menyentuh area agen lain.
- Patuh pada .agent/skills/ yang relevan.
- Ikuti git-convention.skill untuk penamaan branch dan format commit.
- Satu task/slice fungsional = satu branch = satu merge request. Bukan per
  tingkat (level).
- Tulis commit bertahap (banyak commit kecil per task, jangan satu commit besar,
  jangan di-squash), sesuai kebutuhan riwayat commit step-by-step.
- Jika menemui keputusan teknis yang belum ada di Software Design Document,
  HENTIKAN dan laporkan ke manusia, jangan mengarang keputusan.

---

## Agen 1: Backend

- Peran: implementasi API, logika bisnis, dan database.
- Memiliki (owns):
  - BE/** (seluruh kode Go)
  - db/migrations/** (file SQL migration)
- Tidak boleh menyentuh: FE/**
- Skill wajib:
  - git-convention
  - api-response-convention
  - rbac-authorization
  - crud-pattern
  - money-calculation (untuk modul checkout, laporan, refund)
  - order-status-machine (untuk modul yang mengubah status pesanan)
  - atomic-conditional-update (untuk proses ambil kerjaan dan refund overdue)
- Tanggung jawab utama:
  - Entity, repository, usecase, controller, route per modul.
  - Middleware auth + role.
  - Modul kritis sesuai algoritma di Software Design Document (penguncian stok,
    ambil pekerjaan atomik, proses keterlambatan idempotent).
  - Seed data akun demo (admin, seller, buyer, driver).
  - Dokumentasi API (Swagger).

## Agen 2: Frontend

- Peran: implementasi antarmuka pengguna dan integrasi ke API.
- Memiliki (owns):
  - FE/** (seluruh kode React + TypeScript)
- Tidak boleh menyentuh: BE/**
- Skill wajib:
  - git-convention
  - api-response-convention (agar parsing respons konsisten)
- Tanggung jawab utama:
  - Halaman publik (katalog, detail produk, ulasan, login, register).
  - Dashboard per peran (buyer, seller, driver, admin).
  - Komponen UI reusable (Button, Input, Card, Navbar, Footer).
  - Pemilihan peran aktif (modal/halaman) dan menampilkan peran aktif.
  - Integrasi API memakai service class + TanStack Query/Mutation.
  - Ringkasan checkout sebelum konfirmasi.
- Catatan kontrak: selama API backend belum siap, Frontend boleh memakai data
  tiruan (mock) sesuai Kontrak API di Software Design Document, agar dapat
  bekerja paralel dengan Backend.

## Agen 3: Reviewer / QA

- Peran: memverifikasi hasil kerja agen lain sebelum digabung.
- Memiliki (owns): hanya baca seluruh kode; boleh menulis berkas pengujian.
- Skill acuan: seluruh skill (sebagai dasar pemeriksaan).
- Tanggung jawab utama:
  - Memastikan Definition of Done tiap task di workflow terpenuhi.
  - Memeriksa kepatuhan aturan bisnis kritis:
    - Perhitungan uang (PPN 12% dari subtotal − discount, ongkir bebas PPN).
    - Transisi status pesanan sah dan tercatat di history.
    - Otorisasi peran aktif diverifikasi server-side.
    - Keamanan: pencegahan injeksi SQL, pencegahan skrip berbahaya, validasi
      input.
    - Idempotensi proses keterlambatan (tidak ada refund/stok ganda).
  - Memastikan format respons API konsisten.
  - Memastikan kepatuhan git-convention (branch & commit) pada merge request.
  - Menolak dan meminta revisi jika tidak sesuai; tidak meloloskan demi cepat.

---

## Alur Koordinasi

1. Orchestrator membaca progress.md dan workflow.md, memilih task/slice.
2. Mengecek boundary di dokumen ini, lalu menugaskan ke agen yang sesuai.
3. Agen membuat branch sesuai git-convention, mengerjakan mengikuti skill, lalu
   memperbarui progress.md.
4. Agen membuka merge request (satu slice).
5. Reviewer/QA memeriksa terhadap Definition of Done, aturan bisnis, dan
   git-convention.
6. Manusia melakukan review akhir dan menggabungkan (merge).
7. Checkpoint: setelah satu tingkat selesai, manusia menyetujui sebelum lanjut
   ke tingkat berikutnya.
