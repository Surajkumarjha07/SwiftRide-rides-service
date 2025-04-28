import { Partitioners } from "kafkajs";
import kafka from "./kafkaClient.js";

export const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});

const producerInit = async () => {
    await producer.connect();
}

export default producerInit;