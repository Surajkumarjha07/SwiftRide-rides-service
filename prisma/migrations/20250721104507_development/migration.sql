-- CreateTable
CREATE TABLE `rides` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rideId` VARCHAR(191) NOT NULL,
    `captainId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `pickUpLocation` VARCHAR(191) NULL,
    `pickUpLocation_latitude` DOUBLE NULL DEFAULT 0.00,
    `pickUpLocation_longitude` DOUBLE NULL DEFAULT 0.00,
    `destination` VARCHAR(191) NULL,
    `destination_latitude` DOUBLE NOT NULL DEFAULT 0.00,
    `destination_longitude` DOUBLE NOT NULL DEFAULT 0.00,
    `fare` INTEGER NULL,
    `vehicle` VARCHAR(191) NULL,
    `vehicle_number` VARCHAR(191) NULL,
    `status` ENUM('pending', 'in_progress', 'assigned', 'completed', 'cancelled', 'unassigned') NOT NULL DEFAULT 'pending',
    `payment_status` ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',

    UNIQUE INDEX `rides_rideId_key`(`rideId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
