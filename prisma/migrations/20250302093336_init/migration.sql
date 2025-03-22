-- CreateTable
CREATE TABLE `rides` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `captain` VARCHAR(191) NOT NULL,
    `user` VARCHAR(191) NOT NULL,
    `distance` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
