# Use Node 18 on Debian Linux
FROM node:18-bullseye

# Install Python 3 and ffmpeg
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg && \
    apt-get clean

# Set working directory inside container
WORKDIR /app

# Copy everything into the container
COPY . .

# Install Node dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install -r python/requirements.txt

# Expose port for Railway
EXPOSE 8080

# Start your backend
CMD ["node", "server.js"]