import { rideCancelledConsumer } from "../consumerInIt.js";
import rideCancelledHandler from "../handlers/rideCancelledHandler.js";

async function rideCancelled() {
    try {
        await rideCancelledConsumer.subscribe({topic: "ride-cancelled", fromBeginning: true});

        await rideCancelledConsumer.run({
            eachMessage: rideCancelledHandler
        }) 

    } catch (error) {
        if (error instanceof Error) {   
            throw new Error(`Error in ride cancellation consumer! ${error.message}`);
        }
    }
}

export default rideCancelled;