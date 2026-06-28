import { rideRequestConsumer } from "../consumerInIt.js";
import getRideRequestHandler from "../handlers/getRideRequest.handler.js";

async function getRideRequest() {
    try {
        await rideRequestConsumer.subscribe({ topic: "ride-request", fromBeginning: true });
        await rideRequestConsumer.run({
            eachMessage: getRideRequestHandler
        })
    } catch (error) {
        throw new Error(`error in getting ride request:  ${(error as Error).message}`);
    }
}

export default getRideRequest;