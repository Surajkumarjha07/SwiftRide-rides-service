import { captain_not_assigned } from "../consumerInIt.js";
import captainNotAssignedHandler from "../handlers/captainNotAssigned.handler.js";

async function captainNotAssigned() {
    try {
        await captain_not_assigned.subscribe({topic: "no-captain-assigned", fromBeginning: true});

        await captain_not_assigned.run({
            eachMessage: captainNotAssignedHandler
        })

    } catch (error) {
        throw new Error("Error in captain-not-assigned consumer: " + (error as Error).message);
    }
}

export default captainNotAssigned;