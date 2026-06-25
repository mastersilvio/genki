FROM oven/bun:1.3.6-alpine
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile
RUN chown -R bun:bun /app

USER bun
EXPOSE 5174
CMD ["bun", "--cwd", "apps/web", "dev"]
