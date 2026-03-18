# Dependency Resolutions

This file documents forced dependency resolutions in the root `package.json` and their reasons.
The goal is to minimize resolutions and remove them when no longer needed.

## Active Resolutions

### jest

- **Forced version**: `^29`
- **Reason**: Consistency — ensures all workspace packages and transitive dependencies resolve to the same Jest 29.x version, preventing version mismatches across the monorepo.
- **Parent packages**: All 5 workspace services, `@axinom/mosaic-graphql-common`, `@axinom/mosaic-service-common`, `jest-auto-stub`
- **Date added**: 2023-04-18
- **Commit**: `296f757c` — *"chore: bump dependencies, update jest config node bumps for build pipelines"*
- **Can be removed when**: All consumers naturally depend on Jest 29.x (unlikely to be needed since Mosaic packages may lag behind)

### jest-cli

- **Forced version**: `^29`
- **Reason**: Consistency — keeps `jest-cli` aligned with the `jest` resolution above. `jest-cli` is a direct dependency of `jest`, so this ensures the CLI matches the test runner version.
- **Parent packages**: `jest`
- **Date added**: 2023-04-18
- **Commit**: `296f757c` — *"chore: bump dependencies, update jest config node bumps for build pipelines"*
- **Can be removed when**: The `jest` resolution is removed

### @types/jest

- **Forced version**: `^29`
- **Reason**: Consistency — ensures all workspace packages share the same `@types/jest` major version to avoid type conflicts between Jest 29 type definitions.
- **Parent packages**: All 5 workspace services, `jest-auto-stub`
- **Date added**: 2023-04-18
- **Commit**: `296f757c` — *"chore: bump dependencies, update jest config node bumps for build pipelines"*
- **Can be removed when**: The `jest` resolution is removed

### jsonpath-plus

- **Forced version**: `^10.2.0`
- **Reason**: CVE remediation — addresses **CVE-2024-21534** (CVSS 9.8, critical RCE via unsafe `vm` module usage in versions <10.0.0) and **CVE-2025-1302** (CVSS 8.9, incomplete fix for the same issue, patched in 10.3.0). The `^10.2.0` range currently resolves to 10.3.0, covering both CVEs.
- **Parent packages**: `@asyncapi/parser`, `@stoplight/spectral-core`, `nimma` (all transitive via `@axinom/mosaic-cli`)
- **Original selector**: `^5.0.7` / `^7.2.0` (various parents)
- **Date added**: 2025-05-06
- **Commit**: `197ee4eb` — *"[AB#47252] fix: bumping several packages to address CVEs (#443)"*
- **Can be removed when**: `@axinom/mosaic-cli` updates `@asyncapi/parser` to `^3.x` (which uses `jsonpath-plus@^10.0.7` natively)

## Waiting for Upstream Fix

### ajv@7.x (Dependabot #209, #208)

- **Vulnerability**: ReDoS when using `$data` option (medium severity)
- **Current version**: 7.2.4
- **Patched in**: 8.18.0 (major version jump)
- **Blocked by**: `@axinom/mosaic-service-common@0.65.0` depends on `ajv@^7.0.3`; `entitlement-service` and `media-service` directly depend on `ajv@^7.2.4`
- **Date**: 2026-02-23
- **Check again when**: `@axinom/mosaic-service-common` updates to `ajv@^8`

### ajv@5.x (Dependabot #86)

- **Vulnerability**: Prototype Pollution (medium severity)
- **Current version**: 5.5.2
- **Patched in**: 6.12.3 (major version jump)
- **Blocked by**: `@axinom/mosaic-cli` → `@asyncapi/parser` → `@asyncapi/raml-dt-schema-parser` → `ramldt2jsonschema@1.2.3` → `json-schema-migrate@0.2.0` → `ajv@^5.0.0`
- **Date**: 2026-02-23
- **Check again when**: `@axinom/mosaic-cli` updates its AsyncAPI dependency chain

### tar@6.x (Dependabot #203, #192, #189, #186)

- **Vulnerability**: Multiple path traversal and hardlink/symlink vulnerabilities (all high severity)
- **Current version**: 6.2.1
- **Patched in**: 7.5.8 (major version jump)
- **Blocked by**: `@axinom/mosaic-cli@0.52.0` depends on `tar@^6.1.13`
- **Date**: 2026-02-23
- **Check again when**: `@axinom/mosaic-cli` updates to `tar@^7`

### qs@6.13.0 (Dependabot #201, #184)

- **Vulnerability**: arrayLimit bypass DoS (high + low severity)
- **Current version**: 6.13.0
- **Patched in**: 6.14.1 (#184) / 6.14.2 (#201)
- **Blocked by**: `express@4.21.2` and `body-parser@1.20.3` exact-pin `qs@6.13.0`. Express 5.x uses `^6.14.0` but all Mosaic packages use `express@^4.x`
- **Date**: 2026-02-23
- **Check again when**: Express 4.x releases a patch with updated qs, or Mosaic packages migrate to Express 5

### minimatch (Dependabot #204)

- **Vulnerability**: ReDoS via repeated wildcards with non-matching literal in pattern (high severity)
- **Current versions**: 3.1.2, 3.1.3, 4.2.3, 5.1.6, 9.0.5
- **Patched in**: 10.2.1 (major version jump for all consumers)
- **Blocked by**: All consumers (eslint, glob, graphql-config, wsrun, test-exclude, etc.) use `^3`–`^9` ranges. A forced resolution to `^10.2.1` would break the API
- **Date**: 2026-02-23
- **Check again when**: Major ecosystem packages update their minimatch dependency ranges

### tmp (Dependabot #168)

- **Vulnerability**: Arbitrary temporary file/directory write via symbolic link dir parameter (low severity)
- **Current version**: 0.0.33
- **Patched in**: 0.2.4
- **Blocked by**: `@axinom/mosaic-cli` → `@inquirer/prompts@^4.3.0` → `@inquirer/editor@^2.1.3` → `external-editor@^3.1.0` → `tmp@^0.0.33`. Fixed in `@inquirer/editor@5.x` but `@inquirer/prompts@4.x` only allows `^2.x`
- **Date**: 2026-02-23
- **Check again when**: `@axinom/mosaic-cli` updates `@inquirer/prompts` to v5+
