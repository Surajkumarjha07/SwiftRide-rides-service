import express, { Request, Response } from "express";
import dotenv from "dotenv";
import startKafka from "./kafka/index.kafka.js";

dotenv.config();

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello! Suraj, I am ride-service");
})

// kafka setup
startKafka();

app.listen(Number(process.env.PORT), "0.0.0.0", () => {
    console.log("Ride service is running!");
})