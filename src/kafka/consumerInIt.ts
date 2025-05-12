import kafka from "./kafkaClient.js";

const rideRequestConsumer = kafka.consumer({ groupId: "ride-request-group" });
const fetchCaptainConsumer = kafka.consumer({ groupId: "fetch-captains-group" });
const rideAcceptConsumer = kafka.consumer({ groupId: "ride-accepted-group" });
const rideCompletedConsumer = kafka.consumer({ groupId: "ride-completed-group" });
const rideCancelledConsumer = kafka.consumer({ groupId: "ride-cancelled-group" });

async function consumerInit() {
    await Promise.all([
        rideRequestConsumer.connect(),
        fetchCaptainConsumer.connect(),
        rideAcceptConsumer.connect(),
        rideCompletedConsumer.connect(),
        rideCancelledConsumer.connect()
    ])
}

export { consumerInit, rideAcceptConsumer, fetchCaptainConsumer, rideRequestConsumer, rideCompletedConsumer, rideCancelledConsumer };