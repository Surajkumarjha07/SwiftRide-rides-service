# node image
FROM node:18

# working directory
WORKDIR /app

# copying package files
COPY package*.json ./

# installing dependencies
RUN npm install --omit dev

# copying all files
COPY . .

# exposing port to 3000
EXPOSE 4003

# cmd command
CMD [ "npm", "start" ]