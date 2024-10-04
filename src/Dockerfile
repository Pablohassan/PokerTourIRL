# Stage 1: Build Stage
FROM node:20-alpine AS build
LABEL maintainer="Pablo Hassan <sesmanovic@gmail.com>"

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Define build arguments
ARG VITE_REACT_APP_CLERK_PUBLISHABLE_KEY
ARG VITE_WEBSOCKET_URL

# Set environment variables
ENV VITE_REACT_APP_CLERK_PUBLISHABLE_KEY=${VITE_REACT_APP_CLERK_PUBLISHABLE_KEY}
ENV VITE_WEBSOCKET_URL=${VITE_WEBSOCKET_URL}

# Build the application
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine
LABEL maintainer="Pablo Hassan <sesmanovic@gmail.com>"

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration that listens on port 5174
COPY ./src/nginx_frontend.conf /etc/nginx/conf.d/

# Copy the built static files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 5173 for Nginx
EXPOSE 5173

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
