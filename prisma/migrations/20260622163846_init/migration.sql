-- CreateEnum
CREATE TYPE "rideStatus" AS ENUM ('pending', 'in_progress', 'assigned', 'completed', 'cancelled', 'unassigned');

-- CreateEnum
CREATE TYPE "paymentStatus" AS ENUM ('pending', 'success', 'failed');

-- CreateTable
CREATE TABLE "rides" (
    "id" SERIAL NOT NULL,
    "rideId" TEXT NOT NULL,
    "captainId" TEXT,
    "userId" TEXT NOT NULL,
    "pickUpLocation" TEXT,
    "pickUpLocation_latitude" DOUBLE PRECISION DEFAULT 0.00,
    "pickUpLocation_longitude" DOUBLE PRECISION DEFAULT 0.00,
    "destination" TEXT,
    "destination_latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "destination_longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "fare" INTEGER,
    "vehicle" TEXT,
    "vehicle_number" TEXT,
    "status" "rideStatus" NOT NULL DEFAULT 'pending',
    "payment_status" "paymentStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "rides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rides_rideId_key" ON "rides"("rideId");
