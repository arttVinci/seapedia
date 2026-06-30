package main

import (
	"fmt"
	"os"

	"github.com/traa/seapedia/server/internal/config"
)

// @title           SEAPEDIA API
// @version         1.0
// @description     API Documentation for SEAPEDIA platform.
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.email  support@seapedia.com

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @BasePath  /api

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization

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