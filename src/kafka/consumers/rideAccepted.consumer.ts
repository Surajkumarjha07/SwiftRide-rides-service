import { rideAcceptConsumer } from "../consumerInIt.js";
import rideAcceptedHandler from "../handlers/rideAccepted.handler.js";

async function rideAccepted() {
    try {
        await rideAcceptConsumer.subscribe({ topic: "ride-accepted", fromBeginning: true });

        await rideAcceptConsumer.run({
            eachMessage: rideAcceptedHandler
        });

    } catch (error) {
        console.log("error in accepting ride: ", error);
    }
}

export default rideAccepted;