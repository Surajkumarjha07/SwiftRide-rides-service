import { EachMessagePayload } from "kafkajs";
import prisma from "../../config/database.js";
import { rideStatus } from "@prisma/client";

async function captainNotAssignedHandler({ message }: EachMessagePayload) {
    try {
        const { rideData } = JSON.parse(message.value!.toString());
        const { rideId } = rideData;

        if (!rideId) {
            console.log("rideId not available");            
        }

        await prisma.rides.update({
            where: {
                rideId: rideId
            },

            data: {
                status: rideStatus.unassigned
            }
        })

    } catch (error) {
        throw new Error("Error in captain-not-assigned handler: " + (error as Error).message);
    }
}

export default captainNotAssignedHandler;