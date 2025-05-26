import { no_captain_consumer } from "../consumerInIt.js";
import captainNotFoundHandler from "../handlers/captainNotFoundHandler.js";

async function captainNotFound() {
    try {
        await no_captain_consumer.subscribe({ topic: "no-captain-found", fromBeginning: true});
        await no_captain_consumer.run({
            eachMessage: captainNotFoundHandler
        })

    } catch (error) {
        if (error instanceof Error) {
            throw new Error("Error in no-captain-found consumer: " + error.message);
        }
    }
}

export default captainNotFound;