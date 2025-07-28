import { producer } from "../producerInIt.js";

async function sendProducerMessage(topic: string, value: {}) {    
    try {        
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(value) }]
        })

        console.log(`${topic} sent`);
        
    } catch (error) {
        console.log(`error in sending ${topic}: ${error}`);
    }
}

export default sendProducerMessage;