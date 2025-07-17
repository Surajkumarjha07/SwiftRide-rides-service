import { EachMessagePayload } from "kafkajs";
import prisma from "../../config/database.js";
import { rideStatus } from "@prisma/client";
import sendProducerMessage from "../producers/producerTemplate.js";

async function rideAcceptedHandler({ message }: EachMessagePayload) {
    const { captainId, rideData } = JSON.parse(message.value!.toString());
    const { rideId, vehicle, vehicle_number } = rideData;

    await prisma.rides.updateMany({
        where: { rideId: rideId, status: rideStatus.pending },
        data: {
            captainId: captainId,
            status: rideStatus.assigned,
            vehicle: vehicle,
            vehicle_number: vehicle_number
        }
    });

    await sendProducerMessage("ride-confirmed", { captainId, rideData });
}

export default rideAcceptedHandler;