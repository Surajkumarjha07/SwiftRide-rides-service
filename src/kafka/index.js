import { consumerInit } from "./consumerInIt.js";
import captainsFetched from "./consumers/captainsFetched.js";
import getRideRequest from "./consumers/getRideRequest.js";
import rideAccepted from "./consumers/rideAccepted.js";
import rideCompleted from "./consumers/rideCompleted.js";
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
        await captainsFetched();
        await rideAccepted();
        await rideCompleted();
    } catch (error) {
        console.log("error in initializing kafka: ", error);
    }
}

export default startKafka;