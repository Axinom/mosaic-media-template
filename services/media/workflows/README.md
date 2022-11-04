# Media Workflows

## Overview

This is a workflow package (aka Pilet) containing media management workflows.
The workflows can be seen as the Graphical User Interface for the Media Service
which is also included in this repository.

## Setup and Startup

Before starting up, make sure that you have a `.env` file created from the
template. This file is usually created when running the initial setup of the
solution as described in the `README.md` file at the repository root.

The workflow can be started in multiple ways:

- `yarn dev` - this starts the workflow in development/watch mode
- `yarn dev:full` - similar to `yarn dev`, but it will also load the managed
  workflow packages for that environment into the runtime.
- `yarn dev:workflows` (workspace root script) - similar to `yarn dev:full`, but
  will run _all_ workflow packages that exist in the solution as well as the
  managed workflow packages into the runtime.

## GraphQL type generation

The solution uses code generation to generate Typescript types for the GraphQL
API. In order to update the generated types, you want to run `yarn codegen`
whenever you do a change to a `.graphql` file, or the GraphQL schema on the
backend service changed. Depending on how frequently you're doing changes in the
`.graphql` files, you might want to consider running that codegen also in watch
mode, by starting it using `yarn codegen --watch`.
