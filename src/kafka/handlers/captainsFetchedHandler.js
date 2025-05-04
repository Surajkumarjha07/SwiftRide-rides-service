import sendProducerMessage from "../producers/producerTemplate.js";

async function captainsFetchedHandler({ message }) {
    const { captains, rideData } = JSON.parse(message.value.toString());   

    for (const captain of captains) {
        await sendProducerMessage("accept-ride", { captain, rideData });
    }
}

export default captainsFetchedHandler;