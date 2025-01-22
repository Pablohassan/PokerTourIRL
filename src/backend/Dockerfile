# Step 1: Build stage
FROM node:20-alpine AS build
LABEL maintainer="Pablo Hassan YOMBA <sesmanovic@gmail.com>"

# Set the working directory
WORKDIR /app/backend

COPY ./src/backend/package*.json ./
RUN npm install

COPY ./src/backend ./

# Copy config files
COPY tsconfig.json /app/tsconfig.json
COPY tsconfig.node.json /app/tsconfig.node.json
COPY ./src/backend/tsconfig.backend.json ./tsconfig.json

# Generate Prisma client during build
COPY ./src/backend/src/prisma ./prisma
RUN npx prisma generate

# Build the application
RUN npm run build

# Step 2: Production stage
FROM node:20-alpine
LABEL maintainer="Pablo Hassan YOMBA <sesmanovic@gmail.com>"

WORKDIR /app/backend

# Copy only necessary files
COPY --from=build /app/backend/package*.json ./
COPY --from=build /app/backend/build ./build
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start"]