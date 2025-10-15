FROM oven/bun:1-alpine

WORKDIR /app

FROM base AS install

RUN mkdir -p /temp/dev

COPY package.json bun.lockb /temp/dev/
COPY apps/auth-service/package.json /temp/dev/apps/auth-service/
COPY packages/types/package.json /temp/dev/packages/types/
COPY packages/utils/package.json /temp/dev/packages/utils/

RUN cd /temp/dev && bun i --frozen-lockfile

FROM base AS release

COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun run build

WORKDIR /app/apps/auth-service

CMD ["bun", "start"]