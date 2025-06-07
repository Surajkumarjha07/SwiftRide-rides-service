/*
  Warnings:

  - You are about to drop the column `location_latitude` on the `rides` table. All the data in the column will be lost.
  - You are about to drop the column `location_longitude` on the `rides` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `rides` DROP COLUMN `location_latitude`,
    DROP COLUMN `location_longitude`,
    ADD COLUMN `pickUpLocation_latitude` DOUBLE NULL DEFAULT 0.00,
    ADD COLUMN `pickUpLocation_longitude` DOUBLE NULL DEFAULT 0.00;
