BEGIN;

-- clear data and reset sequences
TRUNCATE users, messages, user_roles RESTART IDENTITY CASCADE;

INSERT INTO users (first_name, last_name, email, password_hash, created_at) VALUES 
('John', 'Doe', 'john@example.com', '$2a$10$fakehashfornow1', NOW()),
('Jane', 'Smith', 'jane@example.com', '$2a$10$fakehashfornow2', NOW()),
('Admin', 'User', 'admin@example.com', '$2a$10$fakehashfornow3', NOW());

-- 1=guest, 2=member, 3=admin
INSERT INTO user_roles (user_id, role_id) VALUES 
(1, 1),
(2, 2),
(3, 2),
(3, 3);

INSERT INTO messages (title, content, user_id, created_at) VALUES 
('First Post', 'This is a public message', 1, NOW() - INTERVAL '2 days'),
('Secret Stuff', 'Members can see who wrote this', 2, NOW() - INTERVAL '1 day'),
('Admin Announcement', 'Important club news!', 3, NOW());

COMMIT;