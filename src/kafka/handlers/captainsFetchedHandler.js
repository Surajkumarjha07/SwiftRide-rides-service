import sendProducerMessage from "../producers/producerTemplate.js";

async function captainsFetchedHandler({ message }) {
    const { captains, rideData } = JSON.parse(message.value.toString());   

    for (const captain of captains) {
        await sendProducerMessage("accept-ride", { captain, rideData });

        // later we will emit sockets or something similar to mobile interactivity
    }
}

export default captainsFetchedHandler;