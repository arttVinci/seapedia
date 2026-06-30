CREATE TABLE vouchers (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_amount BIGINT NOT NULL,
    expired_at DATETIME NOT NULL,
    remaining_usage INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
