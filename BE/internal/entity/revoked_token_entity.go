package entity

type RevokedToken struct {
	JTI       string `gorm:"column:jti;primaryKey;type:varchar(255)" json:"jti"`
	ExpiredAt int64  `gorm:"column:expired_at;type:bigint;index:idx_revoked_tokens_expired_at;not null" json:"expired_at"`
}

func (RevokedToken) TableName() string {
	return "revoked_tokens"
}
