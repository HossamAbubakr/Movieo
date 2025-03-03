FROM node:20.9 AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run p:generate
RUN npm run build

FROM node:20.9 AS runtime

WORKDIR /app

COPY --from=base /app/build ./build
COPY --from=base /app/prisma ./prisma
COPY package*.json ./

RUN npm ci --omit=dev
RUN npm run p:generate

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node build/server.js"]
