FROM node:16-alpine as builder

ENV NODE_ENV build

WORKDIR /backend

COPY package-lock.json ./
COPY ./backend ./

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
WORKDIR /backend

COPY --from=builder /backend/package*.json /backend/
COPY --from=builder /backend/node_modules/ /backend/node_modules/
COPY --from=builder /backend/dist/ /backend/dist/

CMD ["node", "dist/src/main.js"]