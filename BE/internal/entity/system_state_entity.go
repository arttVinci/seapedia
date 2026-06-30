package entity

type SystemState struct {
	ID                  int `gorm:"column:id;primaryKey" json:"id"`
	CurrentSimulatedDay int `gorm:"column:current_simulated_day;not null;default:1" json:"current_simulated_day"`
}

func (SystemState) TableName() string {
	return "system_states"
}
