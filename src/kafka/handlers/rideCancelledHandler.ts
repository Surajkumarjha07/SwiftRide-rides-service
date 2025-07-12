import { EachMessagePayload } from "kafkajs";
import prisma from "../../config/database.js";
import { rideStatus } from "@prisma/client";

async function rideCancelledHandler({ message }: EachMessagePayload) {
    try {
        const rideData = JSON.parse(message.value!.toString());
        const { rideId } = rideData;

        await prisma.rides.updateMany({
            where: {
                rideId: rideId,
                status: {
                    in: [rideStatus.pending, rideStatus.assigned]
                }
            },
            data: {
                status: rideStatus.cancelled
            }
        });

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in ride cancellation handler! ${error.message}`);
        }
    }
}

export default rideCancelledHandler;