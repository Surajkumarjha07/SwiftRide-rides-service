import kafka from "./kafkaClient.js";
import producer from "./producer.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rideRequestConsumer = kafka.consumer({ groupId: "ride-request-group" });
const fetchCaptainConsumer = kafka.consumer({ groupId: "fetch-captains-group" });
const rideAcceptConsumer = kafka.consumer({ groupId: "ride-accepted-group" });
const rideCompletedConsumer = kafka.consumer({ groupId: "ride-completed-group"});

let rideData = {};

async function consumerInit() {
    await rideRequestConsumer.connect();
    await fetchCaptainConsumer.connect();
}

async function getRideRequest() {
    try {
        await rideRequestConsumer.subscribe({ topic: "ride-request", fromBeginning: true });
        await rideRequestConsumer.run({
            eachMessage: async ({ message }) => {
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
                console.log(captains);

                for (const captain of captains) {
                    await producer.sendProducerMessage("accept-ride", JSON.stringify({ captain }));
                }
            }
        })
    } catch (error) {
        console.log("error in getting fetched captains: ", error);
    }
}

async function rideAccepted() {
    try {
        await rideAcceptConsumer.subscribe({ topic: "ride-accepted", fromBeginning: true });
        await rideAcceptConsumer.run({
            eachMessage: async ({ message }) => {
                console.log(JSON.parse(message.value.toString()));

                await prisma.rides.update({
                    where: { rideId: rideData.rideId },
                    data: {
                        captainId: JSON.parse(message.value.toString()),
                        status: "in_progress"
                    }
                })
            }
        })
    } catch (error) {
        console.log("error in accepting ride: ", error);
    }
}

async function rideCompleted() {
    try {
        await rideCompletedConsumer.subscribe({ topic: "ride-completed", fromBeginning: true});
        await rideCompletedConsumer.run({
            eachMessage: async ({message}) => {
                console.log(JSON.parse(message.value.toString()));                
            }
        })
    } catch (error) {
        console.log("error in completing ride!");        
    }
}

export default { consumerInit, getRideRequest, captainsFetched, rideAccepted, rideCompleted };