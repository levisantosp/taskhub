FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock /app/
COPY apps/auth-service/package.json bun.lock /app/apps/auth-service/
COPY packages/types/package.json /app/packages/types/
COPY packages/utils/package.json /app/packages/utils/
COPY . .

RUN bun i --frozen-lockfile
RUN bun run build

WORKDIR /app/apps/auth-service

CMD ["bun", "start"]