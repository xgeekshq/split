ARG TAG=18.12.1-alpine

###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:$TAG As development

# Create app directory
WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running yarn install on every code change.
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:$TAG As build

WORKDIR /app

COPY package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. 
#In the previous development stage we ran `yarn` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --from=development /app/node_modules ./node_modules

COPY . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm` removes the existing node_modules directory and passing in --omit=dev ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm prune --omit=dev

###################
# PRODUCTION
###################

FROM node:$TAG As production

# Copy the bundled code from the build stage to the production image
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json

EXPOSE 3200
ENV PORT 3200

# Start the server using the production build
CMD npm run start:prod
