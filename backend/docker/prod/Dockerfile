ARG TAG=18.12.1-alpine

FROM node:$TAG AS builder

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build
RUN npm prune --production

# ---

FROM node:$TAG AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD npm run start:prod