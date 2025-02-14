# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM imbios/bun-node:1-current-alpine AS build
WORKDIR /app

COPY package.json bun.lockb ./

# use ignore-scripts to avoid builting node modules like better-sqlite3
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the entire project
COPY . .

RUN bun --bun run build

# copy production dependencies and source code into final image
FROM oven/bun:1 AS production
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output /app

ENV PORT=80
ENV HOST=0.0.0.0
# run the app
EXPOSE 80
ENTRYPOINT [ "node", "/app/server/index.mjs" ]
