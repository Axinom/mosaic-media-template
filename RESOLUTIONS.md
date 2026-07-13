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

### ajv@5.x / 6.x

- **Vulnerability**: Prototype Pollution (medium severity), ReDoS (medium severity)
- **Current versions**: 5.5.2, 6.5.2, 6.12.6
- **Patched in**: 6.12.3 (Prototype Pollution), 6.14.0 (ReDoS for 6.x) / 8.18.0 (ReDoS for 7.x+)
- **Blocked by**: `@axinom/mosaic-cli` → `@asyncapi/parser@2.1.2` → `ramldt2jsonschema@1.2.3` → `json-schema-migrate@0.2.0` → `ajv@^5.0.0`; also `webapi-parser@0.5.0` uses old ajv
- **Date**: 2026-02-23
- **Check again when**: `@axinom/mosaic-cli` updates `@asyncapi/parser` to `^3.x`

### lodash@4.17.23 via tilde ranges

- **Vulnerability**: Prototype Pollution via array path bypass (medium), Code Injection via `_.template` imports (high)
- **Current version**: 4.17.23
- **Patched in**: 4.18.0
- **Blocked by**: `@graphql-codegen/plugin-helpers` uses `~4.17.0` and `@stoplight/spectral-core`/`@stoplight/spectral-functions` use `~4.17.21` — tilde ranges cap at 4.17.x. The `^4.17.x` consumers have been updated to 4.18.1. Only the tilde-range entry remains.
- **Date**: 2026-04-14
- **Check again when**: `@graphql-codegen/plugin-helpers` or `@stoplight/spectral-core` update their lodash range to `^4.18.0`

### serialize-javascript

- **Vulnerability**: RCE via RegExp.flags/Date.prototype.toISOString (high), CPU Exhaustion DoS (medium)
- **Current version**: 6.0.2
- **Patched in**: 7.0.3 / 7.0.5
- **Blocked by**: `css-minimizer-webpack-plugin@5.0.1` requires `^6.0.1`. Only 5.0.0 and 5.0.1 exist for 5.x. Latest css-minimizer-webpack-plugin (7.x) uses `^7.0.3`, but `piral-cli-webpack5@1.5.3` requires `^5.0.1`.
- **Date**: 2026-03-03
- **Check again when**: `piral-cli-webpack5` updates its css-minimizer-webpack-plugin range

### immutable@~3.7.6

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

## Deferred (Tolerated For Now)

Vulnerabilities we intend to fix eventually, but where the fix is bigger/involved
work (e.g. a major-version migration that needs upstream coordination). The
Dependabot alert is intentionally kept **open** as a tracking reminder — these are
not dismissed and not passively "waiting for upstream".

### uuid

- **Vulnerability**: Missing buffer bounds check in `v3`/`v5`/`v6` when `buf` is provided (medium severity)
- **Current versions**: 8.3.2, 9.0.1
- **Patched in**: 11.1.1 (major version jump)
- **Why deferred**: The bug only affects `v3`/`v5`/`v6` generation when an explicit output `buf` is passed; all consumers (`@axinom/mosaic-message-bus`, `@axinom/mosaic-service-common`, `@azure/core-http`, `rascal`, `pg-transactional-outbox`, `jest-junit`) pin `uuid@^8.3.2` / `^9.0.x` and use `v4` (random), which is unaffected. uuid <11 is also deprecated, so we do want to move off it — but reaching 11.x means coordinating upstream (`@axinom/mosaic-*` ranges) rather than passively waiting, so it is tracked as future work.
- **Date**: 2026-06-09
- **Next step / done when**: Bump the `@axinom/mosaic-*` libraries (and other consumers) so they accept `uuid@^11`, then drop any need for a resolution. Until then the alert stays open.

### tmp

- **Vulnerability**: Arbitrary temp file/dir write via symlink `dir` parameter (low); path traversal via unsanitized prefix/postfix (high)
- **Current version**: 0.0.33
- **Patched in**: 0.2.4 / 0.2.6 — both major-line jumps with API changes
- **Why deferred**: `tmp@0.0.33` is dev-only — pulled solely via `external-editor@3.1.0` (`@graphql-codegen/cli` → `inquirer@8`), not present in any deployed service runtime. `external-editor@3.1.0` (latest, unreleased since) pins `tmp@^0.0.33`; reaching 0.2.6 needs either a forced resolution that risks breaking `external-editor`'s use of the old `tmp` API, or migrating off the `inquirer@8` toolchain. Worth doing eventually, so the alert stays open.
- **Date**: 2026-06-09
- **Next step / done when**: `external-editor` releases a version with an updated `tmp` dep, `@graphql-codegen/cli` stops depending on `inquirer@8`, or a vetted forced resolution to `tmp@^0.2.6` is confirmed safe for `external-editor`.
