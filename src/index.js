import express from "express";
import dotenv from "dotenv";
import startKafka from "./kafka/index.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.send("Hello! Suraj, I am ride-service");
})

// kafka setup
startKafka();

app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log("Ride service is running!");
})