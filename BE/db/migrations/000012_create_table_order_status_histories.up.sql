CREATE TABLE order_status_histories (
    id VARCHAR(36) NOT NULL,
    order_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL,
    note TEXT,
    created_at BIGINT NOT NULL,
    PRIMARY KEY (id),
    INDEX idx_order_status_histories_order_id (order_id),
    CONSTRAINT fk_order_status_histories_order_id FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;