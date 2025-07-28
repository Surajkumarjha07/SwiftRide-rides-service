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
var rideCancelledConsumer = kafkaClient_default.consumer({ groupId: "ride-cancelled-group-ride" });
var no_captain_consumer = kafkaClient_default.consumer({ groupId: "no-captain-group" });
var payment_settled_consumer = kafkaClient_default.consumer({ groupId: "payment-settled-group" });
var captain_not_assigned = kafkaClient_default.consumer({ groupId: "captain-not-assigned" });
async function consumerInit() {
  await Promise.all([
    rideRequestConsumer.connect(),
    fetchCaptainConsumer.connect(),
    rideAcceptConsumer.connect(),
    rideCompletedConsumer.connect(),
    rideCancelledConsumer.connect(),
    no_captain_consumer.connect(),
    payment_settled_consumer.connect(),
    captain_not_assigned.connect()
  ]);
}

// src/config/database.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var database_default = prisma;

// src/kafka/handlers/captainNotAssigned.handler.ts
import { rideStatus } from "@prisma/client";
async function captainNotAssignedHandler({ message }) {
  try {
    const { rideData } = JSON.parse(message.value.toString());
    const { rideId } = rideData;
    if (!rideId) {
      throw new Error("rideId not available");
    }
    await database_default.rides.update({
      where: {
        rideId
      },
      data: {
        status: rideStatus.unassigned
      }
    });
  } catch (error) {
    throw new Error("Error in captain-not-assigned handler: " + error.message);
  }
}
var captainNotAssigned_handler_default = captainNotAssignedHandler;

// src/kafka/consumers/captainNotAssigned.consumer.ts
async function captainNotAssigned() {
  try {
    await captain_not_assigned.subscribe({ topic: "no-captain-assigned", fromBeginning: true });
    await captain_not_assigned.run({
      eachMessage: captainNotAssigned_handler_default
    });
  } catch (error) {
    throw new Error("Error in captain-not-assigned consumer: " + error.message);
  }
}
var captainNotAssigned_consumer_default = captainNotAssigned;

// src/kafka/handlers/captainNotFound.handler.ts
import { rideStatus as rideStatus2 } from "@prisma/client";
async function captainNotFoundHandler({ message }) {
  try {
    const { rideData } = JSON.parse(message.value.toString());
    const { rideId } = rideData;
    console.log("no captain found!");
    await database_default.rides.updateMany({
      where: {
        rideId
      },
      data: {
        status: rideStatus2.unassigned
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in captain-not-found handler: " + error.message);
    }
  }
}
var captainNotFound_handler_default = captainNotFoundHandler;

// src/kafka/consumers/captainNotFound.consumer.ts
async function captainNotFound() {
  try {
    await no_captain_consumer.subscribe({ topic: "no-captain-found-notify-ride", fromBeginning: true });
    await no_captain_consumer.run({
      eachMessage: captainNotFound_handler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error in no-captain-found consumer: " + error.message);
    }
  }
}
var captainNotFound_consumer_default = captainNotFound;

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
    console.log(`${topic} sent`);
  } catch (error) {
    console.log(`error in sending ${topic}: ${error}`);
  }
}
var producerTemplate_default = sendProducerMessage;

// src/kafka/handlers/getRideRequest.handler.ts
import { rideStatus as rideStatus3 } from "@prisma/client";
async function getRideRequestHandler({ message }) {
  const { rideData } = JSON.parse(message.value.toString());
  try {
    await database_default.rides.create({
      data: {
        fare: Math.round(Number(rideData.fare)),
        status: rideStatus3.pending,
        destination: rideData.destination,
        destination_latitude: Number(rideData.destination_latitude),
        destination_longitude: Number(rideData.destination_longitude),
        pickUpLocation: rideData.pickUpLocation,
        pickUpLocation_latitude: Number(rideData.pickUpLocation_latitude),
        pickUpLocation_longitude: Number(rideData.pickUpLocation_longitude),
        rideId: rideData.rideId,
        userId: rideData.userId,
        vehicle: rideData.vehicle
      }
    });
  } catch (error) {
    console.log("error in saving ride data!", error);
  }
  await producerTemplate_default("get-captains", rideData);
}
var getRideRequest_handler_default = getRideRequestHandler;

// src/kafka/consumers/getRideRequest.consumer.ts
async function getRideRequest() {
  try {
    await rideRequestConsumer.subscribe({ topic: "ride-request", fromBeginning: true });
    await rideRequestConsumer.run({
      eachMessage: getRideRequest_handler_default
    });
  } catch (error) {
    console.log("error in getting ride request: ", error);
  }
}
var getRideRequest_consumer_default = getRideRequest;

// src/kafka/handlers/paymenSettled.handler.ts
import { paymentStatus, rideStatus as rideStatus4 } from "@prisma/client";
async function paymentSettledHandler({ message }) {
  try {
    const { rideId } = JSON.parse(message.value.toString());
    await database_default.rides.update({
      where: {
        rideId
      },
      data: {
        status: rideStatus4.completed,
        payment_status: paymentStatus.success
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in payment-settled handler: ${error.message}`);
    }
  }
}
var paymenSettled_handler_default = paymentSettledHandler;

// src/kafka/consumers/paymentSettled.consumer.ts
async function paymentSettled() {
  try {
    await payment_settled_consumer.subscribe({ topic: "payment-settled", fromBeginning: true });
    await payment_settled_consumer.run({
      eachMessage: paymenSettled_handler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in payment-settled consumer: ${error.message}`);
    }
  }
}
var paymentSettled_consumer_default = paymentSettled;

// src/kafka/handlers/rideAccepted.handler.ts
import { rideStatus as rideStatus5 } from "@prisma/client";
async function rideAcceptedHandler({ message }) {
  const { captainId, rideData } = JSON.parse(message.value.toString());
  const { rideId, vehicle, vehicle_number } = rideData;
  await database_default.rides.updateMany({
    where: { rideId, status: rideStatus5.pending },
    data: {
      captainId,
      status: rideStatus5.assigned,
      vehicle,
      vehicle_number
    }
  });
  await producerTemplate_default("ride-confirmed", { captainId, rideData });
}
var rideAccepted_handler_default = rideAcceptedHandler;

// src/kafka/consumers/rideAccepted.consumer.ts
async function rideAccepted() {
  try {
    await rideAcceptConsumer.subscribe({ topic: "ride-accepted", fromBeginning: true });
    await rideAcceptConsumer.run({
      eachMessage: rideAccepted_handler_default
    });
  } catch (error) {
    console.log("error in accepting ride: ", error);
  }
}
var rideAccepted_consumer_default = rideAccepted;

// src/kafka/handlers/rideCancelled.handler.ts
import { rideStatus as rideStatus6 } from "@prisma/client";
async function rideCancelledHandler({ message }) {
  try {
    const rideData = JSON.parse(message.value.toString());
    const { rideId } = rideData;
    await database_default.rides.updateMany({
      where: {
        rideId,
        status: {
          in: [rideStatus6.pending, rideStatus6.assigned]
        }
      },
      data: {
        status: rideStatus6.cancelled
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in ride cancellation handler! ${error.message}`);
    }
  }
}
var rideCancelled_handler_default = rideCancelledHandler;

// src/kafka/consumers/rideCancelled.consumer.ts
async function rideCancelled() {
  try {
    await rideCancelledConsumer.subscribe({ topic: "ride-cancelled", fromBeginning: true });
    await rideCancelledConsumer.run({
      eachMessage: rideCancelled_handler_default
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error in ride cancellation consumer! ${error.message}`);
    }
  }
}
var rideCancelled_consumer_default = rideCancelled;

// src/kafka/kafkaAdmin.ts
async function kafkaInit() {
  const admin = kafkaClient_default.admin();
  console.log("Admin connecting...");
  await admin.connect();
  console.log("Admin connected...");
  const topics = ["no-captain-assigned", "no-captain-found-notify-ride", "ride-request", "payment-settled", "ride-accepted", "ride-cancelled"];
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

// src/kafka/index.kafka.ts
var startKafka = async () => {
  try {
    await kafkaAdmin_default();
    console.log("Consumer initialization...");
    await consumerInit();
    console.log("Consumer initialized...");
    console.log("Producer initialization...");
    await producerInit();
    console.log("Producer initializated");
    await getRideRequest_consumer_default();
    await rideAccepted_consumer_default();
    await rideCancelled_consumer_default();
    await captainNotFound_consumer_default();
    await paymentSettled_consumer_default();
    await captainNotAssigned_consumer_default();
  } catch (error) {
    console.log("error in initializing kafka: ", error);
  }
};
var index_kafka_default = startKafka;

// src/index.ts
dotenv.config();
var app = express();
app.get("/", (req, res) => {
  res.send("Hello! Suraj, I am ride-service");
});
index_kafka_default();
app.listen(Number(process.env.PORT), "0.0.0.0", () => {
  console.log("Ride service is running!");
});
