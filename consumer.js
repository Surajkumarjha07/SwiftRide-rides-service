import kafka from "./kafkaClient.js";

const consumer = kafka.consumer({ groupId: "ride-service-group" });

async function consumerInit() {
    await consumer.connect();
}

async function getRideRequest() {
    try {
        await consumer.subscribe({ topic: "ride-request", fromBeginning: true });
        await consumer.run({
            eachMessage: ({ topic, message, partition }) => {
                console.log(`get ride request from: ${message.value.toString()}`);
            }
        })
    } catch (error) {
        console.log("error in getting ride request: ", error);
    }
}

export default { consumerInit, getRideRequest };