CREATE TABLE wallets (
    id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    balance INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_wallets_user_id (user_id),
    CONSTRAINT fk_wallets_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
