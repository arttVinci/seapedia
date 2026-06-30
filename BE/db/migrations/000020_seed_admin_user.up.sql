INSERT INTO users (id, username, email, password, auth_provider, is_admin, created_at, updated_at)
VALUES (
    'admin-uuid-1234-5678-901234567890',
    'admin',
    'admin@seapedia.com',
    '$2a$10$513x.ssR.zcvDviY.qiu7ue1wOC1ZbBvN/A2Kw0UNktMCFXgyUqa6',
    'local',
    true,
    UNIX_TIMESTAMP(NOW(3)) * 1000,
    UNIX_TIMESTAMP(NOW(3)) * 1000
);

INSERT INTO user_roles (id, user_id, role, created_at, updated_at)
VALUES (
    'admin-role-uuid-1234-5678-90123456',
    'admin-uuid-1234-5678-901234567890',
    'admin',
    UNIX_TIMESTAMP(NOW(3)) * 1000,
    UNIX_TIMESTAMP(NOW(3)) * 1000
);
