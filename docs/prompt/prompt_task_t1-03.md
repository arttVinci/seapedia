# Before AI Polish

oke kita akan memulai task T01-03 yaitu Migration & entity users/user_roles/revoked_tokens, Backend.

gw mau nanti saat buat entity mengikuti pola ini :

type User struct {
ID string `gorm:"column:id;primaryKey"`
Username string `gorm:"column:username;type:varchar(50);unique;index"`
Password string `gorm:"column:password;type:varchar(255)"`
Email string `gorm:"column:email;type:varchar(100);unique;index"`
AuthProvider string `gorm:"column:auth_provider;type:varchar(10)"`

    CreatedAt int64 `gorm:"column:created_at;autoCreateTime:milli"`
    UpdatedAt int64 `gorm:"column:updated_at;autoCreateTime:milli;autoUpdateTime:milli"`

}

func (u \*User) TableName() string {
return "users"
}

ingat ini hanya contoh jangan di jadikan untuk copy paste.

dengan nama file nama_entity.go

lalu untuk migration itu tersimban di direktori be/db/migration, untuk membuat migration ini menggunakan terminal berikut caranya :

All database migration is in db/migrations folder.

Create Migration
migrate create -ext sql -dir db/migrations create_table_xxx

berikut contoh isi file migration :

CREATE TABLE users
(
id VARCHAR(36) NOT NULL,
username VARCHAR(50) NOT NULL,
password VARCHAR(255) NOT NULL,
email VARCHAR(100) NOT NULL,
auth_provider VARCHAR(10) NOT NULL,

    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_users_username (username)

)

ingat ini hanya contoh jangan di jadikan untuk copy paste

untuk down
drop table users;

tetap pedoman kamu itu docs/sdd.md (Bagian 2: struktur folder &

stack), .agent/AGENTS.md, dan skill terkait, lalu susun rencana TANPA menulis

kode.

dan jangan lupa untuk melaporkan cara memenuhi Definition of Done, rencana branch

& commit. Tunjukkan rencana ke saya dan tunggu persetujuan.
poles propmt nya

# After AI Polish

## Task T01-03: Migration & Entity untuk `users`, `user_roles`, `revoked_tokens` (Backend)

### Pedoman yang wajib diikuti

- `docs/sdd.md` —
- `.agent/AGENTS.md`
- Skill terkait yang relevan dengan task ini

### Konvensi Entity (Go / GORM)

- Satu file per entity, dengan nama file `nama_entity.go`
- Ikuti pola tag GORM seperti contoh di bawah ini.
  **PENTING: ini hanya contoh pola, jangan disalin langsung** — sesuaikan kolom dengan kebutuhan masing-masing tabel.

```go
type User struct {
    ID           string `gorm:"column:id;primaryKey"`
    Username     string `gorm:"column:username;type:varchar(50);unique;index"`
    Password     string `gorm:"column:password;type:varchar(255)"`
    Email        string `gorm:"column:email;type:varchar(100);unique;index"`
    AuthProvider string `gorm:"column:auth_provider;type:varchar(10)"`

    CreatedAt int64 `gorm:"column:created_at;autoCreateTime:milli"`
    UpdatedAt int64 `gorm:"column:updated_at;autoCreateTime:milli;autoUpdateTime:milli"`
}

func (u *User) TableName() string {
    return "users"
}
```

### Konvensi Migration

- Lokasi file migration: `db/migrations`
- Cara membuat file migration baru (via terminal):
  migrate create -ext sql -dir db/migrations create_table_xxx
- Contoh isi file `...up.sql` (**hanya contoh, jangan disalin langsung**):

```sql
CREATE TABLE users
(
    id            VARCHAR(36) NOT NULL,
    username      VARCHAR(50) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    email         VARCHAR(100) NOT NULL,
    auth_provider VARCHAR(10) NOT NULL,

    created_at    BIGINT NOT NULL,
    updated_at    BIGINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_users_username (username)
);
```

- Contoh isi file `...down.sql`:

```sql
DROP TABLE users;
```

### Yang harus dikerjakan sekarang (TANPA menulis kode)

1. **Susun rencana kerja**, mencakup:
   - Skema tiap tabel (`users`, `user_roles`, `revoked_tokens`): kolom, tipe data, constraint, index, dan foreign key (jika ada relasi antar tabel)
   - Daftar file migration yang akan dibuat (up & down) per tabel
   - Daftar file entity Go yang akan dibuat
   - Urutan eksekusi migration & pembuatan entity (terutama jika ada dependensi antar tabel, misal `user_roles` mereferensikan `users`)
2. **Jelaskan kesesuaian rencana dengan Definition of Done** task T01-03
3. **Susun rencana branch & commit**:
   - Nama branch (sesuai konvensi penamaan di project)
   - Strategi pembagian commit (misal: per tabel, atau migration dipisah dari entity)
4. **Tampilkan rencana ini ke saya dan tunggu persetujuan** sebelum mulai menulis kode apa pun

### Catatan

- Semua contoh struct Go dan SQL di atas hanya ilustrasi pola, bukan untuk disalin langsung
- Pastikan rencana tetap konsisten dengan struktur folder & stack yang sudah didefinisikan di `docs/sdd.md`
