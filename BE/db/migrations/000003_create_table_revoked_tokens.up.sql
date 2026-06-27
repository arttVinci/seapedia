CREATE TABLE revoked_tokens (
    jti VARCHAR(255) NOT NULL,
    expired_at BIGINT NOT NULL,
    PRIMARY KEY (jti),
    INDEX idx_revoked_tokens_expired_at (expired_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
