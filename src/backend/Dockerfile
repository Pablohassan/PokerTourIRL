# Step 1: Build stage
FROM node:20-alpine AS build
LABEL maintainer="Pablo Hassan YOMBA <sesmanovic@gmail.com>"

# Set the working directory inside the containe
WORKDIR /app/src/backend

COPY ./src/backend/package.json ./package.json
COPY ./src/backend/package-lock.json ./package-lock.json
RUN npm install


COPY ./src/backend ./

# Copy backend's own tsconfig.json
COPY tsconfig.json /app/tsconfig.json  
COPY tsconfig.node.json /app/tsconfig.node.json  
COPY ./src/backend/tsconfig.backend.json ./tsconfig.backend.json  



# Copy the prisma directory, which contains schema.prisma
COPY ./src/backend/src/prisma ./prisma

RUN apk update && apk add --no-cache openssl
# Generate Prisma client

WORKDIR /app/src/backend/src/prisma
RUN npx prisma generate

# Build the backend application
WORKDIR /app/src/backend
RUN npm run build

# Step 2: Production stage
FROM node:20-alpine
LABEL maintainer="Pablo Hassan YOMBA <sesmanovic@gmail.com>"

# Set the working directory inside the container
WORKDIR /app/src/backend



# Copy only the necessary files from the build stage
COPY --from=build /app/src/backend /app/src/backend

COPY --from=build /app/src/backend/package.json /app/src/backend/package.json
COPY --from=build /app/src/backend/package-lock.json /app/src/backend/package-lock.json
# COPY --from=build /app/src/backend/tsconfig.backend.json /app/src/backend/tsconfig.backend.json

COPY --from=build /app/tsconfig.node.json /app/tsconfig.node.json 
COPY --from=build /app/tsconfig.json /app/tsconfig.json
# COPY --from=build /app/backend/dist /app/backend/dist
RUN apk update && apk add --no-cache openssl
# Expose the port your app runs on
EXPOSE 3000

# Run the backend application
CMD ["npm", "run", "start"]