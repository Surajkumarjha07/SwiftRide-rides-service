import { rideAcceptConsumer } from "../consumerInIt.js";
import rideAcceptedHandler from "../handlers/rideAccepted.handler.js";

async function rideAccepted() {
    try {
        await rideAcceptConsumer.subscribe({ topic: "ride-accepted", fromBeginning: true });

        await rideAcceptConsumer.run({
            eachMessage: rideAcceptedHandler
        });

    } catch (error) {
        throw new Error(`error in accepting ride: ${(error as Error).message}`);
    }
}

export default rideAccepted;