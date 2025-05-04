import prisma from "../../prisma/prismaClient.js";

async function rideAcceptedHandler({ message }) {
    // console.log(JSON.parse(message.value.toString()));

    // await prisma.rides.update({
    //     where: { rideId: rideData.rideId },
    //     data: {
    //         captainId: JSON.parse(message.value.toString()),
    //         status: "in_progress"
    //     }
    // })
}

export default rideAcceptedHandler;