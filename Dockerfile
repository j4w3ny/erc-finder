# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine AS build
WORKDIR /app
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
COPY package.json bun.lockb ./

# use ignore-scripts to avoid builting node modules like better-sqlite3
RUN bun install

# Copy the entire project
COPY . .

RUN bun --node run build

# copy production dependencies and source code into final image
FROM oven/bun:1-alpine AS production
WORKDIR /app
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output /app

# run the app
ENV PORT=80
ENV HOST=0.0.0.0

EXPOSE 80
ENTRYPOINT [ "bun", "--node", "run", "/app/server/index.mjs" ]
