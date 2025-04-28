import kafka from "./kafkaClient.js";

const rideRequestConsumer = kafka.consumer({ groupId: "ride-request-group" });
const fetchCaptainConsumer = kafka.consumer({ groupId: "fetch-captains-group" });
const rideAcceptConsumer = kafka.consumer({ groupId: "ride-accepted-group" });
const rideCompletedConsumer = kafka.consumer({ groupId: "ride-completed-group" });

async function consumerInit() {
    await Promise.all([
        rideRequestConsumer.connect(),
        fetchCaptainConsumer.connect(),
        rideAcceptConsumer.connect(),
        rideCompletedConsumer.connect()
    ])
}

export { consumerInit, rideAcceptConsumer, fetchCaptainConsumer, rideRequestConsumer, rideCompletedConsumer };