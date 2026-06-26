package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/sirupsen/logrus"
	"github.com/traa/seapedia/internal/config"
	"github.com/traa/seapedia/internal/delivery/http/route"
	"gorm.io/gorm"
)

func main() {
	// 1. Initialize logger
	config.InitLogger()

	// 2. Load configuration
	cfg, err := config.LoadConfig("config.json")
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}
	logrus.Info("configuration loaded successfully")

	// 3. Initialize database connection
	var db *gorm.DB
	var sqlDB *sql.DB
	db, sqlDB, err = config.NewDatabase(cfg)
	if err != nil {
		logrus.WithError(err).Fatal("failed to connect to database")
	}
	defer sqlDB.Close()
	logrus.Info("database connection established")

	// 4. Create Fiber app with error handler
	app := config.NewFiberApp()
	logrus.Info("fiber app created")

	// 5. Initialize routes
	route.InitRoutes(app, db, cfg)
	logrus.Info("routes initialized")

	// 6. Start server
	addr := fmt.Sprintf(":%d", cfg.App.Port)
	logrus.WithField("port", cfg.App.Port).Info("server starting")
	if err := app.Listen(addr); err != nil {
		logrus.WithError(err).Fatal("server failed to start")
	}
}
