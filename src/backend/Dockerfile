# Step 1: Build stage
FROM node:20-alpine AS build
LABEL maintainer="Pablo Hassan YOMBA <sesmanovic@gmail.com>"

# Set the working directory inside the containe
WORKDIR /app/backend

COPY backend/package.json ./package.json
COPY backend/package-lock.json ./package-lock.json
RUN npm install


COPY backend ./

# Copy backend's own tsconfig.json
COPY backend/tsconfig.json ./tsconfig.json

COPY tsconfig.node.json /app/tsconfig.node.json


# Copy the prisma directory, which contains schema.prisma
COPY backend/src/prisma ./prisma

# Generate Prisma client
WORKDIR /app/src/backend/prisma
RUN npx prisma generate

# Build the backend application
WORKDIR /app/backend
RUN npm run build

# Step 2: Production stage
FROM node:20-alpine
LABEL maintainer="Pablo Hassan YOMBA <sesmanovic@gmail.com>"

# Set the working directory inside the container
WORKDIR /app/src/backend

# Copy only the necessary files from the build stage
COPY --from=build /app/backend /app/backend
COPY --from=build /app/tsconfig.node.json /app/tsconfig.node.json 
# COPY --from=build /app/backend/dist /app/backend/dist

# Expose the port your app runs on
EXPOSE 3000

# Run the backend application
CMD ["npm", "run", "start"]