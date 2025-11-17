CREATE DATABASE IF NOT EXISTS db_mining_app;
USE db_mining_app;

DROP TABLE IF EXISTS tb_users;
DROP TABLE IF EXISTS tb_roles;

CREATE TABLE tb_roles (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO tb_roles (id, name, description) VALUES
(1, 'shipper_planner', 'Perencana pengiriman kapal'),
(2, 'mining_planner', 'Perencana penambangan');

CREATE TABLE tb_users (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY username (username),
  UNIQUE KEY email (email),
  KEY role_id (role_id),
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES tb_roles (id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO tb_users (id, username, email, pass, role_id, created_at) VALUES
(1, 'budi_shipper', 'budi@example.com', '$2y$10$abcdefg1234567890example', 1, '2025-11-04 07:55:39'),
(2, 'andi_mining', 'andi@example.com', '$2y$10$hijklmn0987654321example', 2, '2025-11-04 07:55:39'),
(3, 'kin', 'waw@gmail.com', '$2y$10$hUgDxYUGnmO7GLcHsErshecRi439S4R6TiG86KemwC2tYhdoTtTAO', 1, '2025-11-04 08:49:45');
