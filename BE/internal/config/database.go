package config

import (
	"database/sql"
	"time"

	"github.com/sirupsen/logrus"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
)

// NewDatabase opens a GORM MySQL connection, sets connection pool, and pings.
// Returns the *gorm.DB instance and the underlying *sql.DB for deferred close.
func NewDatabase(cfg *Config) (*gorm.DB, *sql.DB, error) {
	gormDB, err := gorm.Open(mysql.Open(cfg.DB.DSN()), &gorm.Config{
		Logger: gormlogger.Default.LogMode(gormlogger.Warn),
	})
	if err != nil {
		return nil, nil, err
	}

	sqlDB, err := gormDB.DB()
	if err != nil {
		return nil, nil, err
	}

	// Connection pool settings
	sqlDB.SetMaxOpenConns(cfg.DB.MaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.DB.MaxIdleConns)
	sqlDB.SetConnMaxLifetime(time.Duration(cfg.DB.ConnMaxLifetimeMin) * time.Minute)

	// Ping to verify connection
	if err := sqlDB.Ping(); err != nil {
		return nil, nil, err
	}

	logrus.WithFields(logrus.Fields{
		"host":            cfg.DB.Host,
		"port":            cfg.DB.Port,
		"name":            cfg.DB.Name,
		"max_open_conns":  cfg.DB.MaxOpenConns,
		"max_idle_conns":  cfg.DB.MaxIdleConns,
		"conn_max_life":   cfg.DB.ConnMaxLifetimeMin,
	}).Info("database connected successfully")

	return gormDB, sqlDB, nil
}
