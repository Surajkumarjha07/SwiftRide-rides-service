/*
  Warnings:

  - Made the column `destination_latitude` on table `rides` required. This step will fail if there are existing NULL values in that column.
  - Made the column `destination_longitude` on table `rides` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `rides` MODIFY `destination_latitude` DOUBLE NOT NULL DEFAULT 0.00,
    MODIFY `destination_longitude` DOUBLE NOT NULL DEFAULT 0.00;
