-- DropForeignKey
ALTER TABLE `Party` DROP FOREIGN KEY `Party_tournamentId_fkey`;

-- DropForeignKey
ALTER TABLE `PlayerStats` DROP FOREIGN KEY `PlayerStats_partyId_fkey`;

-- DropForeignKey
ALTER TABLE `PlayerStats` DROP FOREIGN KEY `PlayerStats_playerId_fkey`;

-- CreateTable
CREATE TABLE `GameState` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
