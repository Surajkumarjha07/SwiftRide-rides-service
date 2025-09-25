import { consumerInit } from "./consumerInIt.js";
import captainNotAssigned from "./consumers/captainNotAssigned.consumer.js";
import captainNotFound from "./consumers/captainNotFound.consumer.js";
import getRideRequest from "./consumers/getRideRequest.consumer.js";
import paymentSettled from "./consumers/paymentSettled.consumer.js";
import rideAccepted from "./consumers/rideAccepted.consumer.js";
import rideCancelled from "./consumers/rideCancelled.consumer.js";
import kafkaInit from "./kafkaAdmin.js";
import { producerInit } from "./producerInIt.js";

const startKafka = async () => {
    try {
        await kafkaInit();

        console.log("Consumer initialization...");
        await consumerInit();
        console.log("Consumer initialized...");

        console.log("Producer initialization...");
        await producerInit();
        console.log("Producer initializated");

        await getRideRequest();
        await rideAccepted();
        await rideCancelled();
        await captainNotFound();
        await paymentSettled();
        await captainNotAssigned();

    } catch (error) {
        console.log("error in initializing kafka: ", error);
    }
}

export default startKafka;