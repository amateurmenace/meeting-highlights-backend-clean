# Use an official Node.js image with Python preinstalled
FROM node:18-bullseye

# Install system dependencies (Python, pip, ffmpeg)
RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  ffmpeg

# Set working directory
WORKDIR /app

# Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy backend source code
COPY . .

# Install Python dependencies including Whisper
RUN pip3 install --no-cache-dir git+https://github.com/openai/whisper.git

# Make sure uploads folder exists
RUN mkdir -p uploads

# Expose port 8080 for Railway
EXPOSE 8080

# Start server
CMD ["npm", "start"]