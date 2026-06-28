CREATE TABLE promos (
    id VARCHAR(100) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_amount BIGINT NOT NULL,
    expired_at DATETIME NOT NULL
);
