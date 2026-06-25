FROM oven/bun:1.3.6-alpine AS base
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile
RUN bun --cwd apps/api build

USER bun
EXPOSE 3005
CMD ["bun", "apps/api/dist/index.js"]
