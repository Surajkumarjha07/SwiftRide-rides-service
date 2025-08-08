# node image
FROM node:20-slim

# working directory
WORKDIR /app

# copying package files
COPY package*.json ./

# installing dependencies
RUN npm install --omit=dev && npm cache clean --force

# copying all files
COPY . .

# prisma initialization
RUN npx prisma generate --schema=./prisma/schema.prisma

# exposing port to 4003
EXPOSE 4003

# cmd command
CMD [ "npm", "start" ]