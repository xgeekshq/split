# Dev Environment
FROM node:16-alpine AS development

# Container Dir
WORKDIR /app/backend

# Copy package.json (to install all the packages)
COPY package.json ./

# Install the packages (on the package.json)
RUN yarn

# Copy all files
COPY ./ .

# Run the build command
RUN npm run build
