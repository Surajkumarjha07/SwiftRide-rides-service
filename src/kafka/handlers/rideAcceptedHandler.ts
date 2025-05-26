import { EachMessagePayload } from "kafkajs";
import prisma from "../../prisma/prismaClient.js";
import { rideStatus } from "@prisma/client";
import sendProducerMessage from "../producers/producerTemplate.js";

async function rideAcceptedHandler({ message }: EachMessagePayload) {
    const { captainId, rideData } = JSON.parse(message.value!.toString());
    const { rideId } = rideData;

    await prisma.rides.updateMany({
        where: { rideId: rideId, status: rideStatus.pending },
        data: {
            captainId: captainId,
            status: rideStatus.assigned
        }
    });

    await sendProducerMessage("ride-confirmed", { captainId, rideData });
}

export default rideAcceptedHandler;