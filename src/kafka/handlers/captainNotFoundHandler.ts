import { EachMessagePayload } from "kafkajs";
import prisma from "../../config/database.js";
import { rideStatus } from "@prisma/client";
import sendProducerMessage from "../producers/producerTemplate.js";

async function captainNotFoundHandler({ message }: EachMessagePayload) {
    try {
        const { rideData } = JSON.parse(message.value!.toString());
        const { rideId } = rideData;

        await prisma.rides.updateMany({
            where: {
                rideId: rideId
            },

            data: {
                status: rideStatus.unassigned
            }
        })

        await sendProducerMessage("no-captain-found-notify", {rideData});

    } catch (error) {
        if (error instanceof Error) {
            console.log("Error in captain-not-found handler: " + error.message);
        }
    }
}

export default captainNotFoundHandler;