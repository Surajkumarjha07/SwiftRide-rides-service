import express from "express";
import dotenv from "dotenv";
import kafkaInit from "./kafka/kafkaAdmin.js";
import consumer from "./kafka/consumer.js"

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.send("Hello! Suraj, I am ride-service");
})

const startKafka = async () => {
    try {
        await kafkaInit();

        await consumer.consumerInit();

        await consumer.getRideRequest();
    } catch (error) {
        console.log("error in initializing kafka: ", error);
    }
}

startKafka();

app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log("Ride service is running!");
})