import sendProducerMessage from "../producers/producerTemplate.js";

async function captainsFetchedHandler({ message }) {
    const rawData = JSON.parse(message.value.toString());

    for (const captain of rawData.captains) {
        await sendProducerMessage("accept-ride", JSON.stringify({ captain, rideData }));
    }
}

export default captainsFetchedHandler;