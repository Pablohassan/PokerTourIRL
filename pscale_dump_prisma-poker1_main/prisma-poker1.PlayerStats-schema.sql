CREATE TABLE `PlayerStats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `partyId` int NOT NULL,
  `playerId` int NOT NULL,
  `points` int NOT NULL,
  `kills` int NOT NULL DEFAULT '0',
  `buyin` int NOT NULL,
  `rebuys` int NOT NULL,
  `position` int DEFAULT NULL,
  `totalCost` double NOT NULL DEFAULT '0',
  `outAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1345 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
