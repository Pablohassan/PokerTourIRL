CREATE TABLE `Party` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime(3) NOT NULL,
  `tournamentId` int NOT NULL,
  `partyStarted` datetime(3) DEFAULT NULL,
  `partyEnded` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=258 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
