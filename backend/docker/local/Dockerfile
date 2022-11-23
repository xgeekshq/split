# Dev Environment
FROM node:16-alpine AS local

# Container Dir
WORKDIR /app/backend

# Copy package.json (to install all packages)
COPY package.json ./

# Install the packages (on the package.json)
RUN npm i

# Copy all files
COPY ./ .

# Expose port
EXPOSE 3200

# Run in dev mode
CMD ["npm", "start:dev"]