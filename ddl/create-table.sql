-- for available appointment
CREATE TABLE `appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `available` int NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  INDEX `idx_date` (`date`)  -- Adding an index on the date column because this column used in many situation
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- for booked appointment
CREATE TABLE `booked` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `duration` int NULL DEFAULT 30,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- holiday
CREATE TABLE `holiday`(
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- insert holiday data
INSERT INTO holiday
(id, `date`)
VALUES(1, '2024-09-28');
