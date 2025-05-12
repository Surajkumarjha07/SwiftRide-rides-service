import { rideStatus } from "@prisma/client";
import prisma from "../../prisma/prismaClient.js";
import sendProducerMessage from "../producers/producerTemplate.js";
import { EachMessagePayload } from "kafkajs";

async function rideCompletedHandler({ message }: EachMessagePayload) {
    const { id, rideData } = JSON.parse(message.value!.toString().trim());
    const { rideId } = rideData;

    if (!id) {
        throw new Error("Invalid message: ID is missing");
    }

    await prisma.rides.update({
        where: { rideId: rideId },
        data: { status: rideStatus.completed }
    })
}

export default rideCompletedHandler;