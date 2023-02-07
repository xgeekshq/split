ARG TAG=18.14.0-alpine

# Install dependencies only when needed
FROM node:$TAG AS development
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY ./package*.json ./

RUN npm ci

COPY . .

# Rebuild the source code only when needed
FROM node:$TAG AS builder
ENV NODE_ENV=production
WORKDIR /app
COPY --from=development /app/node_modules ./node_modules
COPY . .

RUN npm run build
RUN npm run build-storybook
RUN npm prune --omit=dev

# Production image, copy all the files and run next
FROM node:$TAG AS production
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/cypress.json ./
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD npm run start