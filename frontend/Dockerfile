# ---------- Step 1: Build React app ----------
FROM node:18 AS build
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Build the app (output goes into /app/dist)
RUN npm run build


# ---------- Step 2: Serve with Nginx ----------
FROM nginx:alpine

# Copy built files from step 1 into Nginx's html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional, for SPA + API proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
