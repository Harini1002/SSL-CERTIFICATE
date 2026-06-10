# Use a Node.js LTS base image (Debian-based slim version for smaller footprint)
FROM node:20-slim

# Install Python 3 (required by mailer.py subprocess)
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 && \
    rm -rf /var/lib/apt/lists/*

# Set working directory inside container
WORKDIR /app

# Copy dependency definition files
COPY package*.json ./

# Install packages
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Compile Vite frontend and bundle backend server
RUN npm run build

# Prune development dependencies to keep the final image minimal
RUN npm prune --production

# Hugging Face Spaces requires port 7860
ENV PORT=7860
EXPOSE 7860

# Start server
CMD ["npm", "start"]
