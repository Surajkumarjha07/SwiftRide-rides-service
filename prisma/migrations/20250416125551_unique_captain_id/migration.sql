/*
  Warnings:

  - A unique constraint covering the columns `[captainId]` on the table `rides` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `rides_captainId_key` ON `rides`(`captainId`);
