-- AlterTable
ALTER TABLE `rides` ADD COLUMN `destination_latitude` DOUBLE NULL DEFAULT 0.00,
    ADD COLUMN `destination_longitude` DOUBLE NULL DEFAULT 0.00,
    ADD COLUMN `location_latitude` DOUBLE NULL DEFAULT 0.00,
    ADD COLUMN `location_longitude` DOUBLE NULL DEFAULT 0.00;
