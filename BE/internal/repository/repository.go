package repository

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// Repository adalah generic repository yang menyediakan operasi CRUD dasar
// untuk entity apapun. Repository khusus dapat meng-embed struct ini agar
// tidak perlu mengulang operasi standar.
type Repository[T any] struct {
	Log *logrus.Logger
}

// Create menyimpan entity baru ke database.
func (r *Repository[T]) Create(db *gorm.DB, entity *T) error {
	return db.Create(entity).Error
}

// Update memperbarui entity yang sudah ada di database.
func (r *Repository[T]) Update(db *gorm.DB, entity *T) error {
	return db.Save(entity).Error
}

// Delete menghapus entity dari database.
func (r *Repository[T]) Delete(db *gorm.DB, entity *T) error {
	return db.Delete(entity).Error
}

// CountById menghitung jumlah baris dengan id tertentu. Mengembalikan jumlah
// baris; jika 0 berarti tidak ditemukan.
func (r *Repository[T]) CountById(db *gorm.DB, any interface{}) (int64, error) {
	var total int64
	err := db.Model(any).Count(&total).Error
	return total, err
}

// FindById mencari entity berdasarkan id dan menyimpannya ke dest.
func (r *Repository[T]) FindById(db *gorm.DB, entity *T, id string) error {
	return db.Where("id = ?", id).First(entity).Error
}
