# Use Node.js base image
FROM node:18

# Install Python, pip, and FFmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    apt-get clean

# Create app directory
WORKDIR /app

# Copy package files and install backend dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r python/requirements.txt

# Create uploads and output folders
RUN mkdir -p uploads output

# Expose server port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]