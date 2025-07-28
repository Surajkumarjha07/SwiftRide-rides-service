import { rideRequestConsumer } from "../consumerInIt.js";
import getRideRequestHandler from "../handlers/getRideRequest.handler.js";

async function getRideRequest() {
    try {
        await rideRequestConsumer.subscribe({ topic: "ride-request", fromBeginning: true });
        await rideRequestConsumer.run({
            eachMessage: getRideRequestHandler
        })
    } catch (error) {
        console.log("error in getting ride request: ", error);
    }
}

export default getRideRequest;