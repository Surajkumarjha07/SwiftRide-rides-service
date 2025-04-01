import kafka from "./kafkaClient.js";
import { Partitioners } from "kafkajs"

const consumer = kafka.consumer({ groupId: "ride-service-group" });

async function consumerInit() {
    await consumer.connect();
}

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});

async function getRideRequest() {
    try {
        await consumer.subscribe({ topic: "ride-request", fromBeginning: true });
        await consumer.run({
            eachMessage: async ({ message }) => {
                const rideData = JSON.parse(message.value.toString())
                console.log("ride data: ", rideData);
                
                await producer.connect();
                await producer.send({
                    topic: "captain-notify",
                    messages: [{value: JSON.stringify(rideData)}]
                })
                console.log(`get ride request from: ${message.value.toString()}`);
                await producer.disconnect();
            }
        })
    } catch (error) {
        console.log("error in getting ride request: ", error);
    }
}

export default { consumerInit, getRideRequest };