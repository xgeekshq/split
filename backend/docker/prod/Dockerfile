FROM node:16-alpine as builder

ENV NODE_ENV build

WORKDIR /backend

COPY package*.json ./

RUN npm ci

COPY ./ ./

RUN npm run build
RUN npm prune --staging

# ---

FROM node:16-alpine

ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3200

ENV PORT 3200

USER node
WORKDIR /backend

COPY --from=builder ./package*.json /backend/
COPY --from=builder ./node_modules/ /backend/node_modules/
COPY --from=builder ./dist/ /backend/dist/

CMD ["node", "dist/src/main.js"]