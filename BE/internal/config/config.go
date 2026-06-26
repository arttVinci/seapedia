package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	App AppConfig `mapstructure:"app"`
	DB  DBConfig  `mapstructure:"db"`
	JWT JWTConfig `mapstructure:"jwt"`
}

type AppConfig struct {
	Port int `mapstructure:"port"`
}

type DBConfig struct {
	Host                 string `mapstructure:"host"`
	Port                 int    `mapstructure:"port"`
	User                 string `mapstructure:"user"`
	Password             string `mapstructure:"password"`
	Name                 string `mapstructure:"name"`
	MaxOpenConns         int    `mapstructure:"max_open_conns"`
	MaxIdleConns         int    `mapstructure:"max_idle_conns"`
	ConnMaxLifetimeMin   int    `mapstructure:"conn_max_lifetime_minutes"`
}

type JWTConfig struct {
	Secret      string `mapstructure:"secret"`
	ExpiryHours int    `mapstructure:"expiry_hours"`
}

// DSN returns the MySQL Data Source Name string for database connection.
func (d *DBConfig) DSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		d.User, d.Password, d.Host, d.Port, d.Name)
}

// LoadConfig reads configuration from config.json and environment variables via Viper.
func LoadConfig(path string) (*Config, error) {
	viper.SetConfigFile(path)
	viper.SetConfigType("json")

	// Enable env var override with prefix SEAPEDIA
	// Example: SEAPEDIA_DB_HOST=localhost will override db.host
	viper.SetEnvPrefix("SEAPEDIA")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return &cfg, nil
}
