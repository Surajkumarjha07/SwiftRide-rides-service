-- AlterTable
ALTER TABLE `rides` ADD COLUMN `payment_status` ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending';
