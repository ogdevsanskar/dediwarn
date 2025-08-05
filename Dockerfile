# Multi-stage build for React + Node.js application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development dependencies
FROM base AS dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Build both frontend and backend
RUN npm run build

# Production image
FROM nginx:alpine AS runner

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration for static files
COPY nginx-static.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]