FROM node:18

# Install Python and FFmpeg
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && apt-get clean

# Set working directory
WORKDIR /app

# Copy Node.js dependencies and install
COPY package*.json ./
RUN npm install

# Copy everything else (including Python scripts and requirements)
COPY . .

# Install Python dependencies
RUN pip install --break-system-packages -r requirements.txt
# Start the Node server
CMD ["node", "server.js"]