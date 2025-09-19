# Step 1: Use official Node.js image
FROM node:18

# Step 2: Set working directory inside container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all your app files
COPY . .

# Step 6: Expose the port your app runs on
EXPOSE 5000

# Step 7: Command to run your app
CMD ["npm", "run", "dev"]
