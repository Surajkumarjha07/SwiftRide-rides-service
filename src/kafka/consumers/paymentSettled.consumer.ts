import { payment_settled_consumer } from "../consumerInIt.js";
import paymentSettledHandler from "../handlers/paymenSettled.handler.js";

async function paymentSettled() {
    try {
        
        await payment_settled_consumer.subscribe({topic: "payment-settled", fromBeginning: true});

        await payment_settled_consumer.run({
            eachMessage: paymentSettledHandler
        })

    } catch (error) {
        if (error instanceof Error) {   
            throw new Error(`Error in payment-settled consumer: ${error.message}`);
        }
    }
}

export default paymentSettled;