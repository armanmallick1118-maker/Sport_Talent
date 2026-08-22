# Root Dockerfile for Backend Deployment on Railway
FROM node:18-alpine

WORKDIR /app

# Copy package config and prisma schema from backend folder
COPY backend/package.json backend/package-lock.json* ./
COPY backend/prisma ./prisma

# Install dependencies
RUN npm ci || npm install

# Copy the rest of the backend source code
COPY backend/ ./

# Generate Prisma Client for Supabase
RUN npx prisma generate

# Railway exposes the port dynamically via the PORT env var
EXPOSE $PORT

# Start the Node.js server
CMD ["npm", "run", "start"]
