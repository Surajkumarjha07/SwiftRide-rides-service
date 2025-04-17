/*
  Warnings:

  - You are about to drop the column `userName` on the `rides` table. All the data in the column will be lost.
  - Added the required column `userId` to the `rides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `rides` DROP COLUMN `userName`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;
