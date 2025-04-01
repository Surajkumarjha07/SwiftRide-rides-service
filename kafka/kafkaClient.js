import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({
    clientId: "ride-service",
    brokers: ["localhost:9092"],
    connectionTimeout: 10000,
    requestTimeout: 30000,
    retry: {
        initialRetryTime: 2000,
        retries: 10
    },
    logLevel: logLevel.ERROR
})

export default kafka;