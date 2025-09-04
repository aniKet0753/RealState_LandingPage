# Use Node.js LTS
FROM node:22

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
