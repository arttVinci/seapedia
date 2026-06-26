package model

// WebResponse is the standard success response wrapper.
type WebResponse[T any] struct {
	Data    T       `json:"data"`
	Message string  `json:"message"`
	Success bool    `json:"success"`
	Paging  *Paging `json:"paging,omitempty"`
}

// ApiErrorResponse is the standard error response.
type ApiErrorResponse struct {
	Message    string              `json:"message"`
	StatusCode int                 `json:"statusCode"`
	Errors     map[string][]string `json:"errors,omitempty"`
}

// Paging holds pagination metadata for list endpoints.
type Paging struct {
	Page      int   `json:"page"`
	Size      int   `json:"size"`
	TotalItem int64 `json:"total_item"`
	TotalPage int   `json:"total_page"`
}
