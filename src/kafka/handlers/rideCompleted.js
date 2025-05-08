import { rideStatus } from "@prisma/client";
import prisma from "../../prisma/prismaClient.js";
import sendProducerMessage from "../producers/producerTemplate.js";

async function rideCompletedHandler({ message }) {
    const { id, rideData } = JSON.parse(message.value.toString().trim());
    const { rideId } = rideData;

    if (!id) {
        throw new Error("Invalid message: ID is missing");
    }

    await prisma.rides.update({
        where: { rideId: rideId },
        data: { status: rideStatus.completed }
    })

    // await sendProducerMessage("ride-confirmed", )
}

export default rideCompletedHandler;