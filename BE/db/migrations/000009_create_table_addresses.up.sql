CREATE TABLE addresses (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    label VARCHAR(50),
    recipient VARCHAR(100),
    phone VARCHAR(20),
    full_address VARCHAR(500),
    PRIMARY KEY (id),
    INDEX idx_addresses_user_id (user_id),
    CONSTRAINT fk_addresses_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
