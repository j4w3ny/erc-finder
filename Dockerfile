# Build Stage 1

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

RUN apk update && apk upgrade
RUN apk add --no-cache sqlite

# Copy package.json and your lockfile, here we add pnpm-lock.yaml for illustration
COPY package.json ./

# Install dependencies
RUN pnpm i

# Copy the entire project
COPY . ./

# Build the project
RUN pnpm run build

# Build Stage 2

FROM node:22-alpine
WORKDIR /app
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./

# Change the port and host
ENV PORT=80
ENV HOST=0.0.0.0

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]
