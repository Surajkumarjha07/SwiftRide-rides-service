import { EachMessagePayload } from "kafkajs";
import prisma from "../../config/database.js";
import sendProducerMessage from "../producers/producerTemplate.js";
import { rideStatus } from "@prisma/client";

async function getRideRequestHandler({ message }: EachMessagePayload) {
    const { rideData } = JSON.parse(message.value!.toString());
    
    try {
        await prisma.rides.create({
            data: {
                fare: Math.round(Number(rideData.fare)),
                status: rideStatus.pending,
                destination: rideData.destination,
                destination_latitude: Number(rideData.destination_latitude),
                destination_longitude: Number(rideData.destination_longitude),
                pickUpLocation: rideData.pickUpLocation,
                pickUpLocation_latitude: Number(rideData.pickUpLocation_latitude),
                pickUpLocation_longitude: Number(rideData.pickUpLocation_longitude),
                rideId: rideData.rideId,
                userId: rideData.userId,
                vehicle: rideData.vehicle
            }
        })

    } catch (error) {
        console.log("error in saving ride data!", error);
    }

    await sendProducerMessage("get-captains", rideData);
}

export default getRideRequestHandler;