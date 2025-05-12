import { Partitioners } from "kafkajs";
import kafka from "./kafkaClient.js";

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
});

const producerInit = async () => {
    await producer.connect();
}

export { producerInit, producer };