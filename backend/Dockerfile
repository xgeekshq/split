FROM node:16-alpine as builder

ENV NODE_ENV build

WORKDIR /home/node

COPY . /home/node

RUN npm ci \
    && npm run build \
    && npm prune --staging

# ---

FROM node:16-alpine

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3200

ENV PORT 3200

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/

CMD ["node", "dist/src/main.js"]