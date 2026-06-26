# Skill: Konvensi Git (Branch & Commit)

## Kapan dipakai
Setiap kali agen membuat branch, melakukan commit, dan membuka merge request.
Berlaku untuk semua agen tanpa kecuali.

## Aturan branch
Satu task = satu branch = satu merge request. JANGAN menumpuk banyak task dalam
satu branch. JANGAN membuat branch per tingkat (level).

Format: <type>/<deskripsi-kebab-case>

Type yang dipakai:
- feature/   fitur baru
- fix/       perbaikan bug
- chore/     setup, konfigurasi, hal non-fitur
- docs/      dokumentasi
- refactor/  merapikan kode tanpa mengubah perilaku

Deskripsi: huruf kecil, dipisah tanda hubung, singkat dan jelas.

Contoh:
- feature/auth-login
- feature/seller-product
- feature/checkout
- chore/setup-backend
- docs/init-project-docs

ID task internal (mis. T1-04) TIDAK masuk nama branch. ID dicantumkan di
deskripsi merge request dan di progress.md untuk pelacakan.

## Aturan commit
Gunakan conventional commits. Buat commit BERTAHAP (banyak commit kecil per
task), JANGAN satu commit besar, JANGAN di-squash.

Format: <type>: <deskripsi singkat>

Type commit:
- feat:     menambah fungsionalitas
- fix:      memperbaiki bug
- chore:    setup/konfigurasi
- docs:     dokumentasi
- refactor: merapikan kode
- test:     menambah/memperbaiki pengujian

Deskripsi: huruf kecil, kalimat perintah (imperative), singkat.

Contoh urutan commit dalam satu task auth:
- chore: tambah model request login & register
- feat: implement hash password bcrypt
- feat: implement generate JWT dengan klaim active_role
- feat: implement logout dan denylist revoked_tokens
- docs: tambah swagger untuk endpoint auth

## Aturan merge request
- Satu merge request per task/slice.
- Judul ringkas; deskripsi mencantumkan ID task (mis. "Menyelesaikan T1-04")
  dan ringkasan perubahan.
- Setelah dibuka, perbarui progress.md (status task + tautan merge request).

## Kesalahan yang harus dihindari
- JANGAN membuat satu branch untuk seluruh tingkat.
- JANGAN menumpuk banyak task dalam satu branch/merge request.
- JANGAN melakukan satu commit besar untuk seluruh task.
- JANGAN men-squash riwayat commit.
- JANGAN memasukkan ID task ke nama branch.
