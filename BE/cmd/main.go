package main

import (
	"fmt"
	"os"

	"github.com/traa/seapedia/server/internal/config"
)

func main() {
	viperConfig := config.NewViper()
	log := config.NewLogger(viperConfig)
	db := config.NewDatabase(viperConfig, log)
	validate := config.NewValidator(viperConfig)
	app := config.NewFiber(viperConfig)

	config.Bootstrap(&config.BootstrapConfig{
		DB:               db,
		App:              app,
		Log:              log,
		Validate:         validate,
		Config:           viperConfig,
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = fmt.Sprintf("%d", viperConfig.GetInt("web.port"))
	}

	log.Infof("Server is starting on port :%s", port)

	webPort := viperConfig.GetInt("web.port")
	err := app.Listen(fmt.Sprintf(":%d", webPort))
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}