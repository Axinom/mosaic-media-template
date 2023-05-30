# Introduction

This package contains :

1. Message format schema definitions used for communication across Mosaic
   components.
2. Linting and code generation tools to enable schema-first development of
   messages.

## Current scope

- Common message envelope.
- Entity metadata publish formats for all supported entity types.

# Defining schemas

## Conventions

The directory layout is based on the following structure:

```
.
└── schemas
    └── payloads
        └── media
        │   └── commands
        │   └── event
        └── publish
            ├── movie-published-event.json
            ├── movie-unpublished-event.json
            └── collection-unpublished-event.json
```

Payloads are grouped together by their origin/context and it is possible to
further group message schemas into `event` and `command` subdirectories if
necessary. All schemas that represent either an event or a command should be
suffixed with `-event` or `-command` respectively. This signals the code
generator what files to convert to TS. You can use other other files (e.g.
`common.json`) to store reusable definitions. It is preferable to scope and keep
each message definition as self-contained as possible.

A list of best-practice conventions based on https://json-schema.org:

- Use lower snake case for names (properties, definitions etc.) e.g.
  `video_stream`.
- All top level schemas, properties and definitions should have `description`
  set to something useful.
- All top level schemas must have the `title` property set, it should match the
  file name without extension.
  - This is related to how `json-schema-to-typescript` generates code:
    https://github.com/bcherny/json-schema-to-typescript/issues/214.
- Definitions _can_ have optionally the `title` property set. It will indicate
  `json-schema-to-typescript` to declare these definitions as interfaces,
  otherwise they will be inlined. If `title` is set, it should match the
  definition key.
- Try to avoid `allOf` until better tooling is available (or developed) for
  handling `allOf`s with `$ref`s.'
  - `allOf`'s support is currently sketchy in `json-schema-to-typescript`:
    https://github.com/bcherny/json-schema-to-typescript/issues/96.

## Working with schemas

Execute `yarn dev`, this will start the schema linter and code generator in
watch mode.

If schema changes also affect the publish formats, then also start `yarn dev`
under `services/catalog/publish-schema-to-db`. It will regenerate the SQL on
schema changes and you'll be able to incorporate these changes into the catalog
service.

Currently _all_ JSON schema files under `schemas/` are being linted. When
defining linting rules, it is easier to target individual files with predefined
structure (e.g. known root level properties such as `properties` and
`definitions`) compared to files that include `$ref`s to other files. The linter
tries to resolve all `$ref`s so there is some double linting happening: both on
resolved root files and externally `$ref`d files. This is not ideal and should
probably be reviewed at some point.

Linting rules are defined in `.spectral.yaml`. Again, it is possible to break
these into more granular rule sets in the future as described here:
https://meta.stoplight.io/docs/spectral/docs/getting-started/3-rulesets.md#extending-rulesets.

# Output

All output will be created under `src/generated`, it will mirror the structure
of the root `schemas` directory. You'll find two subdirectories there: `types`
for generated TS interfaces and `schemas` for bundled JSON schemas. The latter
will make it possible to easily validate payloads against a schema later on.
