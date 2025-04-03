import kafka from "./kafkaClient.js";
import producer from "./producer.js";

const rideRequestConsumer = kafka.consumer({ groupId: "ride-request-group" });
const fetchCaptainConsumer = kafka.consumer({ groupId: "fetch-captains-group" });

async function consumerInit() {
    await rideRequestConsumer.connect();
    await fetchCaptainConsumer.connect();
}

async function getRideRequest() {
    try {
        await rideRequestConsumer.subscribe({ topic: "ride-request", fromBeginning: true });
        await rideRequestConsumer.run({
            eachMessage: async ({ message }) => {
                const rideData = JSON.parse(message.value.toString())

                await producer.sendProducerMessage("get-captains", rideData)
                console.log(`get ride request from: ${message.value.toString()}`);
            }
        })
    } catch (error) {
        console.log("error in getting ride request: ", error);
    }
}

async function captainsFetched() {
    try {
        await fetchCaptainConsumer.subscribe({ topic: "captains-fetched", fromBeginning: true })
        await fetchCaptainConsumer.run({
            eachMessage: async ({ message }) => {
                const captains = JSON.parse(message.value.toString());

                for (const captain of captains) {
                    await producer.sendProducerMessage("accept-ride", JSON.stringify({ captain }));
                }
            }
        })
    } catch (error) {
        console.log("error in getting fetched captains: ", error);
    }
}

export default { consumerInit, getRideRequest, captainsFetched };