package entity

type UserRole struct {
	ID        string `gorm:"column:id;primaryKey;type:varchar(36)" json:"id"`
	UserID    string `gorm:"column:user_id;type:varchar(36);uniqueIndex:idx_user_roles_user_id_role;not null" json:"user_id"`
	Role      string `gorm:"column:role;type:varchar(10);uniqueIndex:idx_user_roles_user_id_role;not null" json:"role"`
	CreatedAt int64  `gorm:"column:created_at;autoCreateTime:milli" json:"created_at"`
	UpdatedAt int64  `gorm:"column:updated_at;autoUpdateTime:milli" json:"updated_at"`
}

func (UserRole) TableName() string {
	return "user_roles"
}
