import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
    res.send("Hello! Suraj, I am ride-service");
})

app.listen(process.env.PORT, () => {
    console.log("Ride service is running!");
})