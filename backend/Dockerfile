FROM node:14-alpine as builder

ENV NODE_ENV build

USER node
WORKDIR /home/node

COPY . /home/node

RUN npm ci \
    && npm run build \
    && npm prune --production

# ---

FROM node:14-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/

CMD ["node", "dist/src/main.js"]
