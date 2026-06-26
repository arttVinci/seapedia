package config

import (
	"os"

	"github.com/sirupsen/logrus"
)

// InitLogger initializes the global logrus logger with JSON formatter,
// Info level, and stdout output.
func InitLogger() {
	logrus.SetFormatter(&logrus.JSONFormatter{})
	logrus.SetLevel(logrus.InfoLevel)
	logrus.SetOutput(os.Stdout)

	logrus.Info("logger initialized: json formatter, info level, stdout")
}
