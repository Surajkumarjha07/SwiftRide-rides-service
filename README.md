🚙 Rides Service

The Rides Service is an internal backend service of SwiftRide (Ride-Sharing platform), which is responsible for managing and creating rides.

-----------------------------------------------------------------------------------------------------------------------------------------------

🚀 Features

✅ Manage ride data with full tracking  
✅ Store and update ride status - `pending`, `in_progress`, `assigned`, `completed`, `cancelled`, `unassigned`  
✅ Store and update payment status - `pending`, `success`, `failed`  

-----------------------------------------------------------------------------------------------------------------------------------------------

🛠 Technologies Used

✅ Node.js    
✅ Express  
✅ TypeScript  
✅ MySQL  
✅ Kafka  
✅ Docker  
✅ Prisma ORM  

-----------------------------------------------------------------------------------------------------------------------------------------------

📋 Prerequisites

Ensure you have the following installed ->  
Node.js (for JavaScript/TypeScript backend)  
Express 

Required Packages ->  
dotenv  
prisma  
nodemon  
kafkajs  
tsup (for TypeScript)  
typescript (for TypeScript)  
concurrently (for TypeScript)  

Database ->  
MySQL  

-----------------------------------------------------------------------------------------------------------------------------------------------

📌 Steps to Run

1️⃣ Clone the repository

git clone https://github.com/Surajkumarjha07/SwiftRide-rides-service.git

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables

Create a .env file and configure the following variables ->  

DATABASE_URL=your-database-url  
PORT=your-port-number  

4️⃣ Run the Application

nodemon index.js

🚀 Your Rides Service is now up and running! 🎉

