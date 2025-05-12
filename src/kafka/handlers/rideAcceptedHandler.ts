import { EachMessagePayload } from "kafkajs";
import prisma from "../../prisma/prismaClient.js";
import { rideStatus } from "@prisma/client";
import sendProducerMessage from "../producers/producerTemplate.js";

async function rideAcceptedHandler({ message }: EachMessagePayload) {
    console.log(JSON.parse(message.value!.toString()));
    const { id, rideData } = JSON.parse(message.value!.toString());
    const { rideId } = rideData;

    await prisma.rides.updateMany({
        where: { rideId: rideId, status: rideStatus.pending },
        data: {
            captainId: id,
            status: rideStatus.accepted
        }
    })

    await sendProducerMessage("ride-confirmed", { id, rideData });
}

export default rideAcceptedHandler;