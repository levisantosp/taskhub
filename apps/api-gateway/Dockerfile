FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock /app/
COPY apps/api-gateway/package.json bun.lock /app/apps/api-gateway/
COPY packages/types/package.json /app/packages/types/
COPY packages/utils/package.json /app/packages/utils/
COPY . .

RUN bun i --frozen-lockfile
RUN bun run build

WORKDIR /app/apps/api-gateway

CMD ["bun", "start"]