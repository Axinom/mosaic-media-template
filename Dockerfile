# Use this Dockerfile to build a production image of a node service

# Relative path to local package root - i.e. services/media/service
ARG PACKAGE_ROOT
# NPM Package command name to make production build - i.e. build:media-service:prod
ARG PACKAGE_BUILD_COMMAND

# BASE
FROM node:18-buster-slim AS base
WORKDIR /checkout

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
FROM node:18-buster-slim

ARG PACKAGE_ROOT
ARG PACKAGE_BUILD_COMMAND

WORKDIR "/app/$PACKAGE_ROOT"

COPY --from=build ["/checkout/$PACKAGE_ROOT/package.json", "./"]
COPY --from=build ["/checkout/node_modules", "/app/node_modules/"]
COPY --from=build ["/checkout/$PACKAGE_ROOT/node_modules", "./node_modules/"]
COPY --from=build ["/checkout/$PACKAGE_ROOT/dist", "./dist/"]
COPY --from=build ["/checkout/$PACKAGE_ROOT/migrations", "./migrations/"]

CMD ["node", "dist/index.js"]
