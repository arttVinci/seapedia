package entity

type User struct {
	ID           string `gorm:"column:id;primaryKey;type:varchar(36)" json:"id"`
	Username     string `gorm:"column:username;type:varchar(50);uniqueIndex:idx_users_username;not null" json:"username"`
	Email        string `gorm:"column:email;type:varchar(100);uniqueIndex:idx_users_email;not null" json:"email"`
	Password     string `gorm:"column:password;type:varchar(255);not null" json:"-"`
	AuthProvider string `gorm:"column:auth_provider;type:varchar(10);not null;default:local" json:"auth_provider"`
	IsAdmin      bool   `gorm:"column:is_admin;not null;default:false" json:"is_admin"`
	CreatedAt    int64  `gorm:"column:created_at;autoCreateTime:milli" json:"created_at"`
	UpdatedAt    int64  `gorm:"column:updated_at;autoUpdateTime:milli" json:"updated_at"`
}

func (User) TableName() string {
	return "users"
}
