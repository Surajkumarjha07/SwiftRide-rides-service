// src/index.ts
import express from "express";
import dotenv from "dotenv";

// src/kafka/kafkaClient.ts
import { Kafka, logLevel } from "kafkajs";
var kafka = new Kafka({
  clientId: "ride-service",
  brokers: ["localhost:9092"],
  connectionTimeout: 1e4,
  requestTimeout: 3e4,
  retry: {
    initialRetryTime: 2e3,
    retries: 10
  },
  logLevel: logLevel.ERROR
});
var kafkaClient_default = kafka;

// src/kafka/consumerInIt.ts
var rideRequestConsumer = kafkaClient_default.consumer({ groupId: "ride-request-group" });
var fetchCaptainConsumer = kafkaClient_default.consumer({ groupId: "fetch-captains-group" });
var rideAcceptConsumer = kafkaClient_default.consumer({ groupId: "ride-accepted-group" });
var rideCompletedConsumer = kafkaClient_default.consumer({ groupId: "ride-completed-group" });
var rideCancelledConsumer = kafkaClient_default.consumer({ groupId: "ride-cancelled-group" });
var no_captain_consumer = kafkaClient_default.consumer({ groupId: "no-captain-group" });
var payment_settled_consumer = kafkaClient_default.consumer({ groupId: "payment-settled-group" });
async function consumerInit() {
  await Promise.all([
    rideRequestConsumer.connect(),
    fetchCaptainConsumer.connect(),
    rideAcceptConsumer.connect(),
    rideCompletedConsumer.connect(),
    rideCancelledConsumer.connect(),
    no_captain_consumer.connect(),
    payment_settled_consumer.connect()
  ]);
}

// src/kafka/producerInIt.ts
import { Partitioners } from "kafkajs";
var producer = kafkaClient_default.producer({
  createPartitioner: Partitioners.LegacyPartitioner
});
var producerInit = async () => {
  await producer.connect();
};

// src/kafka/producers/producerTemplate.ts
async function sendProducerMessage(topic, value) {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(value) }]
    });
  } catch (error) {
    console.log(`error in sending ${topic}: ${error}`);
  }
}
var producerTemplate_default = sendProducerMessage;

// src/kafka/handlers/captainsFetchedHandler.ts
async function captainsFetchedHandler({ message }) {
  const { captains, rideData } = JSON.parse(message.value.toString());
  if (!captains) {
    console.log("no captains available!");
    return;
  }
  for (const captain of captains) {
    console.log("capt: " + captain.captainId);
    await producerTemplate_default("accept-ride", { captain, rideData });
  }
}
var captainsFetchedHandler_default = captainsFetchedHandler;

// src/kafka/consumers/captainsFetched.ts
async function captainsFetched() {
  try {
    await fetchCaptainConsumer.subscribe({ topic: "captains-fetched", fromBeginning: true });
    await fetchCaptainConsumer.run({
      eachMessage: captainsFetchedHandler_default
    });
  } catch (error) {
    console.log("error in getting fetched captains: ", error);
  }
}
var captainsFetched_default = captainsFetched;

// src/config/database.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var database_default = prisma;

// src/kafka/handlers/getRideRequestHandler.ts
import { rideStatus } from "@prisma/client";
async function getRideRequestHandler({ message }) {
  let rideData = JSON.parse(message.value.toString());
  try {
    await database_default.rides.create({
      data: {
        fare: Math.round(Number(rideData.fare)),
        status: rideStatus.pending,
        destination: rideData.destination,
        destination_latitude: Number(rideData.destination_latitude),
        destination_longitude: Number(rideData.destination_longitude),
        pickUpLocation: rideData.pickUpLocation,
        pickUpLocation_latitude: Number(rideData.pickUpLocation_latitude),
        pickUpLocation_longitude: Number(rideData.pickUpLocation_longitude),
        rideId: rideData.rideId,
        userId: rideData.userId
      }
    });
  } catch (error) {
    console.log("error in saving ride data!", error);
  }
  await producerTemplate_default("get-captains", rideData);
}
var getRideRequestHandler_default = getRideRequestHandler;

// src/kafka/consumers/getRideRequest.ts
async function getRideRequest() {
  try {
    await rideRequestConsumer.subscribe({ topic: "ride-request", fromBeginning: true });
    await rideRequestConsumer.run({
      eachMessage: getRideRequestHandler_default
    });
  } catch (error) {
    console.log("error in getting ride request: ", error);
  }
}
var getRideRequest_default = getRideRequest;

// src/kafka/handlers/paymenSettledHandler.ts
import { paymentStatus, rideStatus as rideStatus2 } from "@prisma/client";
async function paymentSettledHandler({ message }) {
  try {
    const { userId, captainId, rideId, fare, order } = JSON.parse(message.value.toString());
    await database_default.rides.update({
      where: {
        rideId
      },
      data: {
        status: rideStatus2.completed,
        payment_status: paymentStatus.success
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in payment-settled handler: ${error.message}`);
    }
  }
}
var paymenSettledHandler_default = paymentSettledHandler;

// src/kafka/consumers/paymentSettled.ts
async function paymentSettled() {
  try {
    await payment_settled_consumer.subscribe({ topic: "payment-settled", fromBeginning: true });
    await payment_settled_consumer.run({
      eachMessage: paymenSettledHandler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in payment-settled consumer: ${error.message}`);
    }
  }
}
var paymentSettled_default = paymentSettled;

// src/kafka/handlers/rideAcceptedHandler.ts
import { rideStatus as rideStatus3 } from "@prisma/client";
async function rideAcceptedHandler({ message }) {
  const { captainId, rideData } = JSON.parse(message.value.toString());
  const { rideId } = rideData;
  await database_default.rides.updateMany({
    where: { rideId, status: rideStatus3.pending },
    data: {
      captainId,
      status: rideStatus3.assigned
    }
  });
  await producerTemplate_default("ride-confirmed", { captainId, rideData });
}
var rideAcceptedHandler_default = rideAcceptedHandler;

// src/kafka/consumers/rideAccepted.ts
async function rideAccepted() {
  try {
    await rideAcceptConsumer.subscribe({ topic: "ride-accepted", fromBeginning: true });
    await rideAcceptConsumer.run({
      eachMessage: rideAcceptedHandler_default
    });
  } catch (error) {
    console.log("error in accepting ride: ", error);
  }
}
var rideAccepted_default = rideAccepted;

// src/kafka/handlers/rideCancelledHandler.ts
import { rideStatus as rideStatus4 } from "@prisma/client";
async function rideCancelledHandler({ message }) {
  try {
    const rideData = JSON.parse(message.value.toString());
    const { rideId } = rideData;
    await database_default.rides.updateMany({
      where: {
        rideId,
        status: {
          in: [rideStatus4.pending, rideStatus4.assigned]
        }
      },
      data: {
        status: rideStatus4.cancelled
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in ride cancellation handler! ${error.message}`);
    }
  }
}
var rideCancelledHandler_default = rideCancelledHandler;

// src/kafka/consumers/rideCancelled.ts
async function rideCancelled() {
  try {
    await rideCancelledConsumer.subscribe({ topic: "ride-cancelled", fromBeginning: true });
    await rideCancelledConsumer.run({
      eachMessage: rideCancelledHandler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in ride cancellation consumer! ${error.message}`);
    }
  }
}
var rideCancelled_default = rideCancelled;

// src/kafka/kafkaAdmin.ts
async function kafkaInit() {
  const admin = kafkaClient_default.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin connected...");
  const topics = ["accept-ride"];
  const existingTopics = await admin.listTopics();
  const topicsToCreate = topics.filter((t) => !existingTopics.includes(t));
  if (topicsToCreate.length > 0) {
    await admin.createTopics({
      topics: topicsToCreate.map((t) => ({ topic: t, numPartitions: 1 }))
    });
  }
  console.log("Topics created!");
  await admin.disconnect();
}
var kafkaAdmin_default = kafkaInit;

// src/kafka/index.ts
var startKafka = async () => {
  try {
    await kafkaAdmin_default();
    console.log("Consumer initialization...");
    await consumerInit();
    console.log("Consumer initialized...");
    console.log("Producer initialization...");
    await producerInit();
    console.log("Producer initializated");
    await getRideRequest_default();
    await captainsFetched_default();
    await rideAccepted_default();
    await rideCancelled_default();
    await paymentSettled_default();
  } catch (error) {
    console.log("error in initializing kafka: ", error);
  }
};
var kafka_default = startKafka;

// src/index.ts
dotenv.config();
var app = express();
app.get("/", (req, res) => {
  res.send("Hello! Suraj, I am ride-service");
});
kafka_default();
app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log("Ride service is running!");
});
