# Use Node image with version 16
FROM node:16-alpine

# Container Dir
WORKDIR /app/frontend

# Copy package.json (to install all packages)
COPY ./package.json .

# Install the packages (on the package.json)
RUN yarn install

# Copy all files
COPY ./ .

# Export the port used by Next.js
EXPOSE 3000

# Run uarn dev (as you do via terminal)
CMD ["yarn", "dev"]