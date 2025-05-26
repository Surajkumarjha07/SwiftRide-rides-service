import { rideStatus } from "@prisma/client";
import prisma from "../../prisma/prismaClient.js";
import sendProducerMessage from "../producers/producerTemplate.js";
import { EachMessagePayload } from "kafkajs";

async function rideCompletedHandler({ message }: EachMessagePayload) {
    const { captainId, rideData } = JSON.parse(message.value!.toString().trim());
    const { rideId } = rideData;

    if (!captainId) {
        throw new Error("Invalid message: ID is missing");
    }

    await prisma.rides.update({
        where: { rideId: rideId },
        data: { status: rideStatus.completed }
    })

    await sendProducerMessage("ride-completed-notify-user", { captainId, rideData });
}

export default rideCompletedHandler;