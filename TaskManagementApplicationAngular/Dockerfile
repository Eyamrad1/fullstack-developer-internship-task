# Step 1: Build Angular App
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Angular app (Updated for Angular v17+)
RUN npm run build --configuration=production

# Step 2: Serve the Built Angular App with Nginx
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /app/dist/task-management-application-angular /usr/share/nginx/html

# Expose port 80 (default for Nginx)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
