-- GlobeTrotter Database Schema

CREATE DATABASE IF NOT EXISTS `globetrotter_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `globetrotter_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(30) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT NULL,
  `additional_info` TEXT DEFAULT NULL,
  `profile_image` VARCHAR(500) DEFAULT NULL,
  `language` VARCHAR(20) DEFAULT 'en',
  `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS `trips` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `cover_image` VARCHAR(500) DEFAULT NULL,
  `budget_limit` DECIMAL(12, 2) DEFAULT 0.00,
  `is_public` TINYINT(1) DEFAULT 0,
  `public_slug` VARCHAR(100) DEFAULT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_trips_user_id` (`user_id`),
  INDEX `idx_trips_public_slug` (`public_slug`),
  CONSTRAINT `fk_trips_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Cities Table
CREATE TABLE IF NOT EXISTS `cities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `country` VARCHAR(100) NOT NULL,
  `region` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `cost_index` DECIMAL(5, 2) DEFAULT 1.00,
  `popularity_score` DECIMAL(5, 2) DEFAULT 0.00,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_cities_name` (`name`),
  INDEX `idx_cities_country` (`country`),
  INDEX `idx_cities_region` (`region`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Trip Stops Table
CREATE TABLE IF NOT EXISTS `trip_stops` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `trip_id` INT NOT NULL,
  `city_id` INT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `stop_order` INT NOT NULL DEFAULT 1,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_trip_stops_trip_id` (`trip_id`),
  INDEX `idx_trip_stops_city_id` (`city_id`),
  CONSTRAINT `fk_trip_stops_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_trip_stops_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Activities Catalog Table
CREATE TABLE IF NOT EXISTS `activities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `city_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL,
  `duration_minutes` INT DEFAULT 60,
  `estimated_cost` DECIMAL(10, 2) DEFAULT 0.00,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `rating` DECIMAL(3, 2) DEFAULT 4.50,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_activities_city_id` (`city_id`),
  INDEX `idx_activities_category` (`category`),
  CONSTRAINT `fk_activities_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Trip Activities Table
CREATE TABLE IF NOT EXISTS `trip_activities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `trip_stop_id` INT NOT NULL,
  `activity_id` INT NOT NULL,
  `scheduled_date` DATE NOT NULL,
  `scheduled_time` TIME NOT NULL,
  `activity_order` INT DEFAULT 1,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_trip_activities_stop_id` (`trip_stop_id`),
  INDEX `idx_trip_activities_activity_id` (`activity_id`),
  CONSTRAINT `fk_trip_activities_stop` FOREIGN KEY (`trip_stop_id`) REFERENCES `trip_stops` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_trip_activities_activity` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Expenses Table
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `trip_id` INT NOT NULL,
  `category` ENUM('transport', 'stay', 'activities', 'meals', 'other') NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `expense_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_expenses_trip_id` (`trip_id`),
  INDEX `idx_expenses_category` (`category`),
  CONSTRAINT `fk_expenses_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Saved Destinations Table
CREATE TABLE IF NOT EXISTS `saved_destinations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `city_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_city_unique` (`user_id`, `city_id`),
  INDEX `idx_saved_user` (`user_id`),
  CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
