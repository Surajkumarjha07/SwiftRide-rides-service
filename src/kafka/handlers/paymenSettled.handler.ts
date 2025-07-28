import { EachMessagePayload } from "kafkajs";
import prisma from "../../config/database.js";
import { paymentStatus, rideStatus } from "@prisma/client";

async function paymentSettledHandler({ message }: EachMessagePayload) {
    try {
        const { rideId } = JSON.parse(message.value!.toString());

        await prisma.rides.update({
            where: {
                rideId: rideId
            },
            data: {
                status: rideStatus.completed,
                payment_status: paymentStatus.success
            }
        });

    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Error in payment-settled handler: ${error.message}`);
        }
    }
}

export default paymentSettledHandler;