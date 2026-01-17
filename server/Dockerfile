# BUILD STAGE
FROM node:22-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update && apt-get install -y python3 make g++

# ----------------------------
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server ./server
COPY client ./client
COPY packages/shared ./packages/shared
RUN pnpm install --frozen-lockfile

# ----------------------------
WORKDIR /app/server

RUN pnpm build
RUN pnpm --filter server deploy --prod --legacy /prod/server
COPY server/prisma /prod/server/prisma
RUN DATABASE_URL="postgresql://dummy:5432/dummy" pnpm docker:prisma:generate

# ----------------------------
WORKDIR /app/client
RUN pnpm build

####################################################################

# RUN STAGE
FROM node:22-slim AS runner

RUN apt-get update -y && apt-get install -y openssl

# ----------------------------
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /prod/server ./server
COPY --from=builder /app/client/dist ./client/dist

# ----------------------------
WORKDIR /app/server
COPY server/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 2567

# Start the server
ENTRYPOINT ["./entrypoint.sh"]
CMD ["npm", "run", "docker:start"]