/*
  Warnings:

  - You are about to alter the column `status` on the `rides` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `rides` MODIFY `status` ENUM('pending', 'accepted', 'completed', 'cancelled') NOT NULL DEFAULT 'pending';
