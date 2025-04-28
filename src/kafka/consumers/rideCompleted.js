import { rideCompletedConsumer } from "../consumerInIt.js";
import rideCompletedHandler from "../handlers/rideCompleted.js";

async function rideCompleted() {
    try {
        await rideCompletedConsumer.subscribe({ topic: "ride-completed", fromBeginning: true });
        await rideCompletedConsumer.run({
            eachMessage: rideCompletedHandler
        })
    } catch (error) {
        console.log("error in completing ride!");
    }
}

export default rideCompleted;