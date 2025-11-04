CREATE DATABASE `db_mining_app`

USE `db_mining_app`;

DROP TABLE IF EXISTS `tb_roles`;

CREATE TABLE `tb_roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

insert  into `tb_roles`(`id`,`name`,`description`) values
(1,'shipper_planner','Perencana pengiriman kapal'),
(2,'mining_planner','Perencana penambangan');

DROP TABLE IF EXISTS `tb_users`;

CREATE TABLE `tb_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `pass` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `tb_users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `tb_roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

insert  into `tb_users`(`id`,`username`,`email`,`pass`,`role_id`,`created_at`) values
(1,'budi_shipper','budi@example.com','$2y$10$abcdefg1234567890example',1,'2025-11-04 07:55:39'),
(2,'andi_mining','andi@example.com','$2y$10$hijklmn0987654321example',2,'2025-11-04 07:55:39'),
(3,'kin','waw@gmail.com','$2y$10$hUgDxYUGnmO7GLcHsErshecRi439S4R6TiG86KemwC2tYhdoTtTAO',1,'2025-11-04 08:49:45');

