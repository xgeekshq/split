FROM node:16-alpine

ENV NODE_ENV build

WORKDIR /backend

COPY package*.json ./

RUN npm ci

COPY ./ ./

RUN npm run build

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3200
ENV PORT 3200

CMD ["node", "dist/src/main.js"]

# ---

# FROM node:16-alpine


# USER node
# WORKDIR /backend

# COPY --from=builder ./package*.json /backend/
# COPY --from=builder ./node_modules /backend/node_modules/
# COPY --from=builder ./dist /backend/dist

# CMD ["node", "dist/src/main.js"]