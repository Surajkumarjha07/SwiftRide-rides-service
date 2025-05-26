/*
  Warnings:

  - You are about to drop the column `price` on the `rides` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `rides` DROP COLUMN `price`,
    ADD COLUMN `fare` INTEGER NULL;
