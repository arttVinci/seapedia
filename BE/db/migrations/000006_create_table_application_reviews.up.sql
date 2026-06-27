CREATE TABLE application_reviews (
    id VARCHAR(36) NOT NULL,
    reviewer_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL,
    comment TEXT,
    created_at BIGINT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;