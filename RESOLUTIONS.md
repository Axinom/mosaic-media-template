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
- **Parent packages**: `@asyncapi/parser@2.1.2` (via `@axinom/mosaic-cli`) requires `^7.2.0` — still vulnerable without this resolution. `@stoplight/spectral-core@1.20.0`/`1.21.0` now naturally require `^10.3.0`.
- **Original selector**: `^7.2.0` (`@asyncapi/parser@2.1.2`)
- **Date added**: 2025-05-06
- **Commit**: `197ee4eb` — *"[AB#47252] fix: bumping several packages to address CVEs (#443)"*
- **Can be removed when**: `@axinom/mosaic-cli` updates `@asyncapi/parser` to `^3.x` (which uses `jsonpath-plus@^10.0.7` natively)

## Waiting for Upstream Fix

### ajv@7.x (Dependabot #209, #208)

- **Vulnerability**: ReDoS when using `$data` option (medium severity)
- **Current version**: 7.2.4
- **Patched in**: 8.18.0 (major version jump)
- **Blocked by**: `@axinom/mosaic-service-common@0.66.0` depends on `ajv@^7.0.3`; `entitlement-service` and `media-service` directly depend on `ajv@^7.2.4`
- **Date**: 2026-02-23
- **Check again when**: `@axinom/mosaic-service-common` updates to `ajv@^8`

### ajv@5.x (Dependabot #86)

- **Vulnerability**: Prototype Pollution (medium severity)
- **Current version**: 5.5.2
- **Patched in**: 6.12.3 (major version jump)
- **Blocked by**: `@axinom/mosaic-cli` → `@asyncapi/parser@2.1.2` → `@asyncapi/raml-dt-schema-parser@4.0.3` → `ramldt2jsonschema@1.2.3` → `json-schema-migrate@0.2.0` → `ajv@^5.0.0`
- **Date**: 2026-02-23
- **Check again when**: `@axinom/mosaic-cli` updates `@asyncapi/parser` to `^3.x`

### qs@6.13.0 (Dependabot #201, #184)

- **Vulnerability**: arrayLimit bypass DoS (high + low severity)
- **Current version**: 6.13.0
- **Patched in**: 6.14.1 (#184) / 6.14.2 (#201)
- **Blocked by**: `express@4.21.2` and `body-parser@1.20.3` exact-pin `qs@6.13.0`. Express 5.x uses `^6.14.0` but all Mosaic packages use `express@^4.x`
- **Date**: 2026-02-23
- **Check again when**: Express 4.x releases a patch with updated qs, or Mosaic packages migrate to Express 5

### minimatch@3.1.2 (Dependabot #219)

- **Vulnerability**: ReDoS via multiple non-adjacent GLOBSTAR segments (high severity)
- **Current version**: 3.1.2
- **Patched in**: 3.1.3
- **Blocked by**: `@stoplight/spectral-core@1.20.0`/`1.21.0` exact-pins `minimatch@3.1.2`. The `^3.x` consumers have been split into a separate lockfile entry and resolve to 3.1.3 (patched). Only the exact-pin entry remains vulnerable.
- **Date**: 2026-03-03
- **Check again when**: `@stoplight/spectral-core` updates its minimatch dependency

### serialize-javascript (Dependabot #223)

- **Vulnerability**: RCE via RegExp.flags and Date.prototype.toISOString() (high severity)
- **Current version**: 6.0.2
- **Patched in**: 7.0.3 (major version jump)
- **Blocked by**: `terser-webpack-plugin` and `css-minimizer-webpack-plugin` require `^6.0.1`/`^6.0.2`. Latest versions still use `^6.x`.
- **Date**: 2026-03-03
- **Check again when**: `terser-webpack-plugin` updates to `serialize-javascript@^7`

### rollup (Dependabot #214)

- **Vulnerability**: Arbitrary File Write via Path Traversal (high severity)
- **Current version**: 2.79.2
- **Patched in**: 2.80.0
- **Blocked by**: `@stoplight/spectral-ruleset-bundler@latest` pins `rollup@~2.79.2` (tilde range only allows 2.79.x)
- **Date**: 2026-03-03
- **Check again when**: `@stoplight/spectral-ruleset-bundler` updates its rollup dependency
