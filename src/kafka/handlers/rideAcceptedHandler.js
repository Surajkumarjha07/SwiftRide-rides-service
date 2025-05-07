import prisma from "../../prisma/prismaClient.js";
import { rideStatus } from "@prisma/client";

async function rideAcceptedHandler({ message }) {
    console.log(JSON.parse(message.value.toString()));
    const { id, rideData } = JSON.parse(message.value.toString());
    const { rideId } = rideData;

    await prisma.rides.updateMany({
        where: { rideId: rideId, status: rideStatus.pending },
        data: {
            captainId: id,
            status: rideStatus.accepted
        }
    })
}

export default rideAcceptedHandler;