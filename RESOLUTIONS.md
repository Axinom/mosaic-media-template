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
- **Can be removed when**: All consumers naturally depend on Jest 29.x (unlikely to be needed since `jest-auto-stub@1.0.8` still depends on `jest@^26.6.3`)

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

### axios@1.14.0 (Dependabot #257)

- **Vulnerability**: NO_PROXY Hostname Normalization Bypass leads to SSRF (critical severity)
- **Current version**: 1.14.0
- **Patched in**: 1.15.0
- **Blocked by**: `npmMinimalAgeGate: '7d'` in `.yarnrc.yml` — axios 1.15.0 was published on 2026-04-08, less than 7 days ago. Yarn refuses to resolve to it.
- **Date**: 2026-04-14
- **Check again when**: After 2026-04-15 (delete the `axios` lockfile entry and run `yarn install --no-immutable`)

### ajv@7.x (Dependabot #209, #208)

- **Vulnerability**: ReDoS when using `$data` option (medium severity)
- **Current version**: 7.2.4
- **Patched in**: 8.18.0 (major version jump)
- **Blocked by**: `@axinom/mosaic-service-common@0.66.0` depends on `ajv@^7.0.3`; `entitlement-service` and `media-service` directly depend on `ajv@^7.2.4`
- **Date**: 2026-02-23
- **Check again when**: `@axinom/mosaic-service-common` updates to `ajv@^8`

### ajv@5.x / 6.x (Dependabot #86, npm audit)

- **Vulnerability**: Prototype Pollution (medium severity), ReDoS (medium severity)
- **Current versions**: 5.5.2, 6.5.2, 6.12.6
- **Patched in**: 6.12.3 (Prototype Pollution), 6.14.0 (ReDoS for 6.x) / 8.18.0 (ReDoS for 7.x+)
- **Blocked by**: `@axinom/mosaic-cli` → `@asyncapi/parser@2.1.2` → `ramldt2jsonschema@1.2.3` → `json-schema-migrate@0.2.0` → `ajv@^5.0.0`; also `webapi-parser@0.5.0` uses old ajv
- **Date**: 2026-02-23
- **Check again when**: `@axinom/mosaic-cli` updates `@asyncapi/parser` to `^3.x`

### lodash@4.17.23 via tilde ranges (Dependabot #254, #255)

- **Vulnerability**: Prototype Pollution via array path bypass (medium), Code Injection via `_.template` imports (high)
- **Current version**: 4.17.23
- **Patched in**: 4.18.0
- **Blocked by**: `@graphql-codegen/plugin-helpers` uses `~4.17.0` and `@stoplight/spectral-core`/`@stoplight/spectral-functions` use `~4.17.21` — tilde ranges cap at 4.17.x. The `^4.17.x` consumers have been updated to 4.18.1. Only the tilde-range entry remains.
- **Date**: 2026-04-14
- **Check again when**: `@graphql-codegen/plugin-helpers` or `@stoplight/spectral-core` update their lodash range to `^4.18.0`

### minimatch@3.1.2 (Dependabot #219, npm audit)

- **Vulnerability**: ReDoS via multiple non-adjacent GLOBSTAR segments (high severity)
- **Current version**: 3.1.2
- **Patched in**: 3.1.3 / 3.1.4
- **Blocked by**: `@stoplight/spectral-core@1.20.0` exact-pins `minimatch@3.1.2`. Latest `spectral-core@1.22.0` uses `^3.1.4` but was published 2026-04-13, blocked by the 7-day age gate.
- **Date**: 2026-03-03
- **Check again when**: After 2026-04-20 (delete the `@stoplight/spectral-core` lockfile entry and run `yarn install --no-immutable`)

### serialize-javascript (Dependabot #223, #247)

- **Vulnerability**: RCE via RegExp.flags/Date.prototype.toISOString (high), CPU Exhaustion DoS (medium)
- **Current version**: 6.0.2
- **Patched in**: 7.0.3 (#223), 7.0.5 (#247)
- **Blocked by**: `css-minimizer-webpack-plugin@5.0.1` requires `^6.0.1`. Only 5.0.0 and 5.0.1 exist for 5.x. Latest css-minimizer-webpack-plugin (7.x) uses `^7.0.3`, but `piral-cli-webpack5@1.5.3` requires `^5.0.1`.
- **Date**: 2026-03-03
- **Check again when**: `piral-cli-webpack5` updates its css-minimizer-webpack-plugin range

### rollup@2.79.2 (Dependabot #214)

- **Vulnerability**: Arbitrary File Write via Path Traversal (high severity)
- **Current version**: 2.79.2
- **Patched in**: 2.80.0
- **Blocked by**: `@stoplight/spectral-ruleset-bundler@1.5.2` pins `rollup@~2.79.2`. Latest `spectral-ruleset-bundler@1.7.0` uses `~2.80.0` but was published 2026-04-13, blocked by the 7-day age gate.
- **Date**: 2026-03-03
- **Check again when**: After 2026-04-20 (delete the `@stoplight/spectral-ruleset-bundler` lockfile entry and run `yarn install --no-immutable`)

### immutable@~3.7.6 (Dependabot #229)

- **Vulnerability**: Prototype Pollution (high severity)
- **Current version**: 3.7.6
- **Patched in**: 3.8.3
- **Blocked by**: `@ardatan/relay-compiler@12.0.0` tilde-pins `immutable@~3.7.6` (allows only 3.7.x). `@graphql-tools/relay-operation-optimizer@7.1.3` uses `@ardatan/relay-compiler@^13.0.1` (fixed), but `@graphql-codegen/visitor-plugin-common@2.x` requires `^6.5.0` of relay-operation-optimizer.
- **Date**: 2026-03-12
- **Check again when**: `@graphql-codegen/visitor-plugin-common` releases a v3+ that accepts `@graphql-tools/relay-operation-optimizer@^7`

### brace-expansion@1.1.11 (npm audit)

- **Vulnerability**: ReDoS (low severity), Zero-step sequence process hang (medium severity)
- **Current version**: 1.1.11
- **Patched in**: 2.0.3 (major version jump)
- **Blocked by**: `minimatch@3.x` and `minimatch@4.x` use `^1.1.7`, capped at 1.x. Fix only available in 2.x.
- **Date**: 2026-04-14
- **Check again when**: `minimatch@3.x` updates to use `brace-expansion@^2.x` (unlikely for 3.x line)

### tmp@^0.0.33 (Dependabot #168)

- **Vulnerability**: Arbitrary temp file/dir write via symlink (low severity)
- **Current version**: 0.0.33
- **Patched in**: 0.2.4
- **Blocked by**: `external-editor@3.1.0` (latest) pins `tmp@^0.0.33`; `^0.0.33` resolves only `0.0.33` in strict semver. `external-editor` has not released a new version since 3.1.0.
- **Date**: 2026-03-12
- **Check again when**: `external-editor` releases a new version with an updated `tmp` dep, or `@graphql-codegen/cli` stops depending on `inquirer@8`
