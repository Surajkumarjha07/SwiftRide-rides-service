import express from "express";
import dotenv from "dotenv";
import kafkaInit from "./kafka/kafkaAdmin.js";
import consumer from "./kafka/consumer.js"
import producer from "./kafka/producer.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.send("Hello! Suraj, I am ride-service");
})

const startKafka = async () => {
    try {
        await kafkaInit();

        console.log("Consumer initialization...");
        await consumer.consumerInit();
        console.log("Consumer initialized...");

        console.log("Producer initialization...");
        await producer.producerInit();
        console.log("Producer initializated");

        await consumer.getRideRequest();
        await consumer.captainsFetched();
    } catch (error) {
        console.log("error in initializing kafka: ", error);
    }
}

startKafka();

app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log("Ride service is running!");
})