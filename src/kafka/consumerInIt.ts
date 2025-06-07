import kafka from "./kafkaClient.js";

const rideRequestConsumer = kafka.consumer({ groupId: "ride-request-group" });
const fetchCaptainConsumer = kafka.consumer({ groupId: "fetch-captains-group" });
const rideAcceptConsumer = kafka.consumer({ groupId: "ride-accepted-group" });
const rideCompletedConsumer = kafka.consumer({ groupId: "ride-completed-group" });
const rideCancelledConsumer = kafka.consumer({ groupId: "ride-cancelled-group" });
const no_captain_consumer = kafka.consumer({ groupId: "no-captain-group" });
const payment_settled_consumer = kafka.consumer({ groupId: "payment-settled-group" });

async function consumerInit() {
    await Promise.all([
        rideRequestConsumer.connect(),
        fetchCaptainConsumer.connect(),
        rideAcceptConsumer.connect(),
        rideCompletedConsumer.connect(),
        rideCancelledConsumer.connect(),
        no_captain_consumer.connect(),
        payment_settled_consumer.connect()
    ])
}

export { consumerInit, rideAcceptConsumer, fetchCaptainConsumer, rideRequestConsumer, rideCompletedConsumer, rideCancelledConsumer, no_captain_consumer, payment_settled_consumer };