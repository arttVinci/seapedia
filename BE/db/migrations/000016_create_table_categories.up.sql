CREATE TABLE categories (
    id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_categories (
    product_id VARCHAR(36) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (product_id, category_id),
    CONSTRAINT fk_product_categories_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_categories_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
