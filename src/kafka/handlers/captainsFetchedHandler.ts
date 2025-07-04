import { EachMessagePayload } from "kafkajs";
import sendProducerMessage from "../producers/producerTemplate.js";

async function captainsFetchedHandler({ message }: EachMessagePayload) {    
    const { captains, rideData } = JSON.parse(message.value!.toString());   

    if (!captains) {
        console.log("no captains available!");
        return;
    }    

    for (const captain of captains) {        
        console.log("capt: " + captain.captainId);
        
        await sendProducerMessage("accept-ride", { captain, rideData });

        // later we will emit sockets or something similar to mobile interactivity
    }
}

export default captainsFetchedHandler;