package entity

type ApplicationReview struct {
	ID           string `gorm:"column:id;primaryKey;type:varchar(36)"`
	ReviewerName string `gorm:"column:reviewer_name;type:varchar(100);not null"`
	Rating       int    `gorm:"column:rating;not null"`
	Comment      string `gorm:"column:comment;type:text"`
	CreatedAt    int64  `gorm:"column:created_at;autoCreateTime:milli"`
}

func (ApplicationReview) TableName() string {
	return "application_reviews"
}
