

async function getRideRequestHandler({ message }) {
    rideData = JSON.parse(message.value.toString());

    try {
        await prisma.rides.create({
            data: {
                price: rideData.price,
                status: rideData.status,
                destination: rideData.destination,
                pickUpLocation: rideData.pickUpLocation,
                rideId: rideData.rideId,
                userId: rideData.userId
            }
        })

    } catch (error) {
        console.log("error in saving ride data!", error);
    }

    await producer.sendProducerMessage("get-captains", rideData)
    console.log(`get ride request from: ${message.value.toString()}`);
}

export default getRideRequestHandler;