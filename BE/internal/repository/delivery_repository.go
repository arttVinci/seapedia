package repository

import (
	"time"

	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/server/internal/entity"
	"gorm.io/gorm"
)

type DeliveryRepository struct {
	Repository[entity.Delivery]
	Log *logrus.Logger
}

func NewDeliveryRepository(log *logrus.Logger) *DeliveryRepository {
	return &DeliveryRepository{Log: log}
}

// TakeAtomic performs an atomic conditional UPDATE on the deliveries table,
// using optimistic locking to prevent double-take.
// The UPDATE only succeeds if:
//   - delivery.driver_id IS NULL (no driver has taken it yet)
//   - orders.status = 'Menunggu Pengiriman' (order is ready for pick-up)
//
// If rows affected == 0, the job was already taken by another driver.
func (r *DeliveryRepository) TakeAtomic(tx *gorm.DB, orderID, driverID string) error {
	now := time.Now().UnixMilli()
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
