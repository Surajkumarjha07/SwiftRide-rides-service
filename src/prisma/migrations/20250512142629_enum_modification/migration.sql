-- AlterTable
ALTER TABLE `rides` MODIFY `status` ENUM('pending', 'in_progress', 'accepted', 'completed', 'cancelled') NOT NULL DEFAULT 'pending';
