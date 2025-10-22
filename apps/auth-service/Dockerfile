FROM node:22.21.0-alpine

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml /app/
COPY apps/auth-service/package.json pnpm-lock.yaml /app/apps/auth-service/
COPY packages/types/package.json /app/packages/types/
COPY packages/utils/package.json /app/packages/utils/
COPY packages/entities/package.json /packages/entities/

RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm build

WORKDIR /app/apps/auth-service

CMD ["pnpm", "start"]