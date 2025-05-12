import { fetchCaptainConsumer } from "../consumerInIt.js";
import captainsFetchedHandler from "../handlers/captainsFetchedHandler.js";

async function captainsFetched() {
    try {
        await fetchCaptainConsumer.subscribe({ topic: "captains-fetched", fromBeginning: true })
        await fetchCaptainConsumer.run({
            eachMessage: captainsFetchedHandler
        })
    } catch (error) {
        console.log("error in getting fetched captains: ", error);
    }
}

export default captainsFetched;