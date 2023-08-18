-- CreateTable
CREATE TABLE `Tournament` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Party` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `tournamentId` INTEGER NOT NULL,
    `partyStarted` DATETIME(3) NULL,
    `partyEnded` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Player` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlayerStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `partyId` INTEGER NOT NULL,
    `playerId` INTEGER NOT NULL,
    `points` INTEGER NOT NULL,
    `kills` INTEGER NOT NULL DEFAULT 0,
    `buyin` INTEGER NOT NULL,
    `rebuys` INTEGER NOT NULL,
    `position` INTEGER NULL,
    `totalCost` DOUBLE NOT NULL DEFAULT 0.0,
    `outAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Party` ADD CONSTRAINT `Party_tournamentId_fkey` FOREIGN KEY (`tournamentId`) REFERENCES `Tournament`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerStats` ADD CONSTRAINT `PlayerStats_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `Party`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlayerStats` ADD CONSTRAINT `PlayerStats_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Player`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
