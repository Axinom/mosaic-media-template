# Use this Dockerfile to build a production image of a node service

# Relative path to local package root - i.e. services/media/service
ARG PACKAGE_ROOT
# NPM Package command name to make production build - i.e. build:media-service:prod
ARG PACKAGE_BUILD_COMMAND

# BASE
FROM node:22.22.3-alpine3.24@sha256:f0a08e0402831ac4097e9825704bc2dfe6d2c1333de99686a89ca649159b02c8 AS base
WORKDIR /checkout

# Use the repo-pinned Yarn Berry (via packageManager + .yarnrc.yml yarnPath)
# instead of the classic Yarn 1 bundled in the node image. Without this the
# build re-resolves dependencies off the committed lockfile and drifts onto
# versions incompatible with TypeScript 4.9.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable

# Setup safe-chain for supply chain security
RUN npm install -g @aikidosec/safe-chain \
    && safe-chain setup-ci

ARG PACKAGE_ROOT
RUN test -n "$PACKAGE_ROOT" || (echo "PACKAGE_ROOT not set" && false)

ARG PACKAGE_BUILD_COMMAND
RUN test -n "$PACKAGE_BUILD_COMMAND" || (echo "PACKAGE_BUILD_COMMAND not set" && false)

# BUILD
FROM base AS build

ARG PACKAGE_ROOT
ARG PACKAGE_BUILD_COMMAND

COPY [".", "."]
RUN npm run $PACKAGE_BUILD_COMMAND
RUN cp -rL node_modules node_modules_full
RUN rm -rf node_modules
RUN mv node_modules_full node_modules
RUN mkdir -p "$PACKAGE_ROOT/node_modules"
RUN if [ ! -d /checkout/$PACKAGE_ROOT/migrations ]; then mkdir -p /checkout/$PACKAGE_ROOT/migrations; fi

# RELEASE
FROM node:22.22.3-alpine3.24@sha256:f0a08e0402831ac4097e9825704bc2dfe6d2c1333de99686a89ca649159b02c8

ARG PACKAGE_ROOT
ARG PACKAGE_BUILD_COMMAND

WORKDIR "/app/$PACKAGE_ROOT"

COPY --from=build ["/checkout/$PACKAGE_ROOT/package.json", "./"]
COPY --from=build ["/checkout/node_modules", "/app/node_modules/"]
COPY --from=build ["/checkout/$PACKAGE_ROOT/node_modules", "./node_modules/"]
COPY --from=build ["/checkout/$PACKAGE_ROOT/dist", "./dist/"]
COPY --from=build ["/checkout/$PACKAGE_ROOT/migrations", "./migrations/"]

RUN chown -R node:node /app
USER node

CMD ["node", "dist/index.js"]
