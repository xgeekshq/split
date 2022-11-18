# Dev Environment
FROM node:16-alpine AS dev

# Container Dir
WORKDIR /app/backend

# Copy package.json (to install all packages)
COPY package.json ./

# Install the packages (on the package.json)
RUN yarn

# Copy all files
COPY ./ .

# Expose port
EXPOSE 3200

# Run in dev mode
CMD ["yarn", "start:dev"]