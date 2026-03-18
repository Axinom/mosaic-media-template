# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mosaic Media Template — a monorepo for media management services built on the Axinom Mosaic platform. Contains 5 backend services (media, catalog, entitlement, channel, vod-to-live), shared libraries, and React micro-frontend workflows.

## Commands

```bash
# Install dependencies
yarn

# Create local .env files from templates
yarn apply-templates

# Start Docker infrastructure (PostgreSQL, RabbitMQ, pgAdmin)
yarn infra:up
yarn infra:down

# Database setup
yarn db:reset              # Create/reset databases
yarn setup                 # Initialize all services

# Development
yarn dev:libs              # Watch-compile libs/media-messages
yarn dev:services          # Watch-compile all services
yarn dev:workflows         # Start workflow dev server on port 10053

# Testing
yarn test:reset:dbs        # Initialize test databases (run once before tests)
yarn test                  # Run all tests
yarn test:ci               # CI mode with JUnit coverage reports

# Building
yarn build                 # Build all services (excludes vod-to-live and channel by default)
yarn lint                  # ESLint with auto-fix

# Database migrations
yarn db:commit             # Commit schema to migration history
yarn db:update-schema      # Update schema dump
```

To run a single test file:
```bash
yarn jest path/to/file.spec.ts
```

## Architecture

### Monorepo Structure

- `services/*/service/` — Node.js backend services
- `services/*/workflows/` — React micro-frontend UI for management UI (not present for all services)
- `libs/media-messages/` — Shared message type definitions (commands, events, payloads) shared across services

### Backend Services

Each service follows the same structure under `src/`:
- `index.ts` — Bootstrap: Express, PostGraphile, auth middleware, message bus, DB pools
- `domains/` — Business logic grouped by domain (e.g., movies, tvshows, collections)
- `graphql/` — PostGraphile setup and custom GraphQL plugins
- `messaging/` — RabbitMQ message handlers and registration
- `ingest/` — Data ingestion logic
- `publishing/` — Publishing/snapshot logic
- `generated/` — Auto-generated DB types (Zapatos) and GraphQL types; do not edit manually
- `tests/` — Integration/DB tests (`.db.spec.ts` suffix)

**Key technologies per service:**
- **Database**: PostgreSQL + [Zapatos](https://jawj.github.io/zapatos/) (type-safe query builder with generated types)
- **GraphQL API**: [PostGraphile](https://www.graphile.org/postgraphile/) — auto-generates GraphQL from DB schema
- **Auth**: `@axinom/mosaic-id-guard` middleware (Axinom ID service)
- **Messaging**: RabbitMQ via `@axinom/mosaic-message-bus` with transactional inbox/outbox pattern (`@axinom/mosaic-transactional-inbox-outbox`)
- **Migrations**: `graphile-migrate`

**Bootstrap sequence** (`index.ts`): load config → check ID service → run migrations → create DB pools → sync permissions → register message bus → setup PostGraphile → start HTTP server.

### Frontend Workflows (Piral Micro-Frontends)

Located in `services/*/workflows/src/`:
- `index.tsx` — Entry point
- `Stations/` — Feature areas (e.g., Movies, TV Shows)
- `apolloClient/` — GraphQL client setup
- `piletConfig.ts` — Piral configuration

Dev server runs on port 10053 and connects to a host Mosaic application.

After modifying GraphQL queries or mutations in a workflow, regenerate TypeScript types by running `yarn codegen` from the workflow package directory (e.g., `services/media/workflows/`). This runs `graphql-codegen` against the configured schema and outputs typed hooks and operations into the `generated/` folder. Requires the corresponding backend service to be running.

### Shared Messages Library

`libs/media-messages/` contains shared event/command schemas. Types are code-generated via `@axinom/mosaic-cli msg-codegen`. After changing schemas, regenerate types before using them in services.

## Code Conventions

- **TypeScript 4.9, Node 22** (see `.nvmrc`) target across all packages
- **Functional style** — avoid classes where possible, prefer functions and plain objects
- **ESLint** enforces: no `any`, explicit return types on module boundaries, no `console.log` (except in tests), top-level `describe` blocks in tests
- **Prettier**: single quotes, trailing commas, arrow parens always
- Test files: `*.spec.ts` (unit) and `*.db.spec.ts` (integration with DB)
- DB integration tests use `createTestContext()` to get a pooled connection; clean up in `afterEach`
