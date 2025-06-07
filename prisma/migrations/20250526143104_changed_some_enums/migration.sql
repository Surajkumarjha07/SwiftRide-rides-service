/*
  Warnings:

  - The values [accepted] on the enum `rides_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `rides` MODIFY `status` ENUM('pending', 'in_progress', 'assigned', 'completed', 'cancelled', 'unassigned') NOT NULL DEFAULT 'pending';
