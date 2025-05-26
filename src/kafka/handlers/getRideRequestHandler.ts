import { EachMessagePayload } from "kafkajs";
import prisma from "../../prisma/prismaClient.js";
import sendProducerMessage from "../producers/producerTemplate.js";
import { rideStatus } from "@prisma/client";

async function getRideRequestHandler({ message }: EachMessagePayload) {
    let rideData = JSON.parse(message.value!.toString());

    try {
        await prisma.rides.create({
            data: {
                fare: Math.round(Number(rideData.fare)),
                status: rideStatus.pending,
                destination: rideData.destination,
                destination_latitude: Number(rideData.destination_latitude),
                destination_longitude: Number(rideData.destination_longitude),
                pickUpLocation: rideData.pickUpLocation,
                location_latitude: Number(rideData.location_latitude),
                location_longitude: Number(rideData.location_longitude),
                rideId: rideData.rideId,
                userId: rideData.userId
            }
        })

    } catch (error) {
        console.log("error in saving ride data!", error);
    }

    await sendProducerMessage("get-captains", rideData);
    console.log(`get ride request from: ${message.value!.toString()}`);
}

export default getRideRequestHandler;