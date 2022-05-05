# Use node alpine as it's a small node image
FROM node:16-alpine

# Create the directory on the node image
# where our Next.js app will live
#RUN mkdir -p /app/frontend

# Set /app/frontend as the working directory
WORKDIR /app/frontend

COPY ./package.json .

RUN yarn install

COPY ./ .

EXPOSE 3000

# Run yarn dev, as we would via the command line
CMD ["yarn", "dev"]