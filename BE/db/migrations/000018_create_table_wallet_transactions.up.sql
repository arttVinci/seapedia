CREATE TABLE wallet_transactions (
    id VARCHAR(36) NOT NULL,
    wallet_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount INT NOT NULL,
    description VARCHAR(500),
    created_at BIGINT NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_wallet_transactions_wallet_id (wallet_id),
    CONSTRAINT fk_wallet_transactions_wallet_id FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
