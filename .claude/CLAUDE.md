# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the Axinom Mosaic Media Template - a comprehensive media management platform built with Node.js, TypeScript, PostgreSQL, and React. The solution consists of multiple microservices, each handling different aspects of media content management including ingestion, cataloging, entitlement, and publishing.

## Architecture

### Service Structure
- **Media Service** (`services/media/service/`): Core media content management, ingestion workflows, and metadata handling
- **Catalog Service** (`services/catalog/service/`): Public catalog API for consuming published content
- **Entitlement Service** (`services/entitlement/service/`): Content access control and geo-blocking
- **Channel Service** (`services/channel/service/`): Live streaming and linear channel management
- **VoD-to-Live Service** (`services/vod-to-live/service/`): Video-on-demand to live stream conversion

### Frontend Workflows
Each service has corresponding React-based workflow applications (`*/workflows/`) built as micro-frontends using Piral.

### Shared Libraries
- **media-messages** (`libs/media-messages/`): Shared message schemas and types for inter-service communication

## Key Technologies
- **Backend**: Node.js/TypeScript with PostGraphile for auto-generated GraphQL APIs
- **Database**: PostgreSQL with Graphile Migrate for schema management
- **Messaging**: RabbitMQ with Rascal for reliable message passing
- **Frontend**: React with Piral micro-frontend architecture
- **Authentication**: Axinom ID Guard integration
- **Build**: Yarn workspaces with wsrun for orchestration

## Development Commands

### Initial Setup
```bash
yarn                    # Install dependencies
yarn apply-templates    # Create local config files from templates
yarn infra:up          # Start Docker infrastructure (PostgreSQL, pgAdmin)
yarn db:reset          # Initialize databases
yarn setup             # Configure all services
```

### Development Workflow
```bash
# Start development servers
yarn dev:libs          # Build shared libraries in watch mode (run first)
yarn dev:services      # Start backend services in watch mode
yarn dev:workflows     # Start frontend workflows in watch mode

# Alternative: Include all services
yarn dev:services:all   # Includes channel and vod-to-live services
yarn dev:workflows:all  # Includes all workflow UIs
```

### Testing
```bash
yarn test:reset:dbs    # Initialize test databases
yarn test              # Run all tests
yarn test:cov          # Run with coverage report
```

### Database Operations
```bash
yarn db:reset          # Reset all service databases
yarn db:commit         # Commit pending migrations (per service)
yarn db:update-schema  # Update schema files
```

### Production Builds
```bash
yarn build:media-service:prod      # Build media service for production
yarn build:catalog-service:prod    # Build catalog service for production
yarn build:entitlement-service:prod # Build entitlement service for production
yarn build:media-workflows:prod    # Build media workflows package
```

### Utilities
```bash
yarn lint              # Lint and fix code
yarn quick-deploy      # Interactive deployment to Axinom Cloud
yarn util:token        # Generate auth tokens for development
```

## Service-Specific Commands

Each service supports these common commands:
- `build` - TypeScript compilation
- `dev` - Development mode with hot reload
- `test` - Run service tests
- `db:reset` - Reset service database
- `db:commit` - Commit database migrations

## Code Architecture Patterns

### Database Layer
- Uses **Zapatos** for type-safe database access
- **PostGraphile** generates GraphQL schemas from PostgreSQL
- **Graphile Migrate** handles database migrations
- Row-level security (RLS) for multi-tenant data isolation

### Messaging Architecture
- **Transactional Outbox/Inbox** pattern for reliable message delivery
- Service-specific message handlers in `messaging/handlers/`
- Message schemas defined in `libs/media-messages/`

### Permission System
- Granular permissions defined in `domains/permission-definition.ts`
- Permissions synchronized with ID service on startup
- GraphQL operations are mapped to specific permissions

### Frontend Structure (Workflows)
- **Stations**: Main UI sections (Movies, Episodes, Collections, etc.)
- **Apollo Client** with custom fetch for authenticated requests
- **Piral extensions** for micro-frontend integration
- **Generated GraphQL** types from backend schemas

### Publishing Flow
- Content goes through: Draft → Snapshot → Published states
- Validation rules applied before publishing
- Snapshots capture point-in-time content state

## Important Notes

### Environment Configuration
- Root `.env` contains shared configuration
- Service-specific `.env` files for local overrides
- Template files (`.template`) must be copied and configured

### Database Migrations
- Always use `db:commit` to finalize schema changes
- Run `internal:zapatos` after schema changes for type updates
- Test databases require separate initialization

### Message Bus Integration
- All inter-service communication uses RabbitMQ
- Message handlers are registered during service startup
- Ensure message schemas match between services

### Testing Approach
- Integration tests use dedicated test databases
- Run `test:reset:dbs` when test structure changes
- Services include both unit and database integration tests

### Micro-Frontend Development
- Workflows are built as independent Piral pilets
- Shared components and utilities in respective service folders
- GraphQL queries co-located with React components