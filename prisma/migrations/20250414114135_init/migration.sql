/*
  Warnings:

  - You are about to drop the column `captain` on the `rides` table. All the data in the column will be lost.
  - You are about to drop the column `distance` on the `rides` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `rides` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `rides` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[rideId]` on the table `rides` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `captainId` to the `rides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rideId` to the `rides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `rides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `rides` DROP COLUMN `captain`,
    DROP COLUMN `distance`,
    DROP COLUMN `user`,
    ADD COLUMN `captainId` VARCHAR(191) NOT NULL,
    ADD COLUMN `destination` VARCHAR(191) NULL,
    ADD COLUMN `pickUpLocation` VARCHAR(191) NULL,
    ADD COLUMN `rideId` VARCHAR(191) NOT NULL,
    ADD COLUMN `userName` VARCHAR(191) NOT NULL,
    MODIFY `price` VARCHAR(191) NULL,
    MODIFY `status` ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX `rides_rideId_key` ON `rides`(`rideId`);
