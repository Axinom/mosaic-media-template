# Dependency Resolutions

This file documents forced dependency resolutions in the root `package.json` and their reasons.
The goal is to minimize resolutions and remove them when no longer needed.

## Active Resolutions

### jsonpath-plus

- **Forced version**: `^10.2.0`
- **Reason**: CVE remediation — addresses **CVE-2024-21534** (CVSS 9.8, critical RCE via unsafe `vm` module usage in versions <10.0.0) and **CVE-2025-1302** (CVSS 8.9, incomplete fix for the same issue, patched in 10.3.0). The `^10.2.0` range currently resolves to 10.3.0, covering both CVEs.
- **Parent packages**: `@axinom/mosaic-cli@0.58.0` now pulls `@asyncapi/parser@^3.6.0`, which natively requires `jsonpath-plus@^10.0.7` — as do `@stoplight/spectral-core@1.23.1` (`^10.3.0`) and `nimma@0.2.3`. The resolution is still required because `@asyncapi/modelina@5.10.1` → `@asyncapi/multi-parser@2.3.0` additionally pulls `@asyncapi/parser@2.1.2` and `@asyncapi/parser@3.0.0-next-major-spec.8`, **both of which still declare `jsonpath-plus@^7.2.0`** (vulnerable).
- **Original selector**: `^7.2.0` (`@asyncapi/parser@2.1.2`, `@asyncapi/parser@3.0.0-next-major-spec.8`)
- **Date added**: 2025-05-06
- **Last verified**: 2026-11-03
- **Commit**: `197ee4eb` — *"[AB#47252] fix: bumping several packages to address CVEs (#443)"*
- **Can be removed when**: `@asyncapi/multi-parser` drops its `@asyncapi/parser@2.x` / `3.0.0-next-major-spec.x` legacy parsers, or those releases update `jsonpath-plus` to `^10.x`

### @graphql-tools/utils

- **Forced version**: `^12.0.3` for the `^11.0.0` selector only (`"@graphql-tools/utils@^11.0.0": "^12.0.3"`); currently resolves to 12.1.0, the same version the `^12.x` consumers already use
- **Reason**: Prototype Pollution in `mergeDeep` (GHSA-7mx3-vvmw-hjmv, high; affects `<=12.0.0`, patched in 12.0.1)
- **Parent packages**: `@graphql-codegen/plugin-helpers@6.3.0` and `@graphql-codegen/visitor-plugin-common@6.3.0`, pulled by the community plugins `@graphql-codegen/typescript-graphql-request@7.1.0` and `@graphql-codegen/typescript-react-apollo@5.0.0` (both latest stable; only an `8.0.0-alpha` of `typescript-graphql-request` exists). Dev-only (code generation), not present in any deployed service runtime.
- **Original selector**: `^11.0.0`
- **Safety check**: with the resolution in place, `yarn codegen` output was byte-identical to the unforced 11.2.2 output for all generated files
- **Date added**: 2026-11-04
- **Can be removed when**: `typescript-graphql-request` and `typescript-react-apollo` ship stable releases on `@graphql-codegen/plugin-helpers@^7` (which uses `@graphql-tools/utils@^12`)

## Waiting for Upstream Fix

### ajv@5.x / 6.5.2

- **Vulnerability**: Prototype Pollution (medium, GHSA — patched 6.12.3), ReDoS via `$data` (medium)
- **Current versions**: 5.5.2, 6.5.2 (the `^6.12.4` / `^6.12.5` / `^8.x` consumers resolve to 6.14.0, 6.15.0 and 8.20.0 and are unaffected)
- **Patched in**: 6.12.3 (Prototype Pollution), 6.14.0 (ReDoS for 6.x) / 8.18.0 (ReDoS for 7.x+)
- **Blocked by**: `json-schema-migrate@0.2.0` requires `ajv@^5.0.0` (reached via `@axinom/mosaic-cli` → `@asyncapi/multi-parser` → `@asyncapi/parser@2.1.2` → `ramldt2jsonschema@1.2.3`); `webapi-parser@0.5.0` pins `ajv@6.5.2` exactly
- **Date**: 2026-02-23
- **Last verified**: 2026-11-03
- **Check again when**: `@asyncapi/multi-parser` drops the legacy `@asyncapi/parser@2.x` chain, or `webapi-parser` releases a version without the exact `6.5.2` pin

### serialize-javascript

- **Vulnerability**: RCE via `RegExp.flags` / `Date.prototype.toISOString` (high), CPU Exhaustion DoS via crafted array-like objects (medium)
- **Current version**: 6.0.2
- **Patched in**: 7.0.3 / 7.0.5
- **Blocked by**: `css-minimizer-webpack-plugin` — every 5.x and 7.x release (latest 7.0.4) requires `serialize-javascript@^6.0.x`; only `css-minimizer-webpack-plugin@8.0.0` moves to `^7.0.3`. `piral-cli-webpack5` (locked 1.5.3; every release since 1.8.0, latest 1.12.4) requires `css-minimizer-webpack-plugin@^7`, so bumping piral alone does not help.
- **Date**: 2026-03-03
- **Last verified**: 2026-11-03
- **Check again when**: `piral-cli-webpack5` accepts `css-minimizer-webpack-plugin@^8`, or `css-minimizer-webpack-plugin@7.x` ships with `serialize-javascript@^7`

## Deferred (Tolerated For Now)

Vulnerabilities we intend to fix eventually, but where the fix is bigger/involved
work (e.g. a major-version migration that needs upstream coordination). The
Dependabot alert is intentionally kept **open** as a tracking reminder — these are
not dismissed and not passively "waiting for upstream".

### uuid

- **Vulnerability**: Missing buffer bounds check in `v3`/`v5`/`v6` when `buf` is provided (medium severity)
- **Current versions**: 8.3.2, 9.0.1 (a patched 14.0.1 is also present for `^14.0.0` consumers)
- **Patched in**: 11.1.1 (major version jump)
- **Why deferred**: The bug only affects `v3`/`v5`/`v6` generation when an explicit output `buf` is passed; all consumers (`@axinom/mosaic-message-bus`, `@axinom/mosaic-service-common`, `@azure/core-http`, `rascal`, `pg-transactional-outbox`) pin `uuid@^8.3.2` / `^9.0.x` and use `v4` (random), which is unaffected. uuid <11 is also deprecated, so we do want to move off it — but reaching 11.x means coordinating upstream (`@axinom/mosaic-*` ranges) rather than passively waiting, so it is tracked as future work.
- **Date**: 2026-06-09
- **Last verified**: 2026-11-03
- **Next step / done when**: Bump the `@axinom/mosaic-*` libraries (and other consumers) so they accept `uuid@^11`, then drop any need for a resolution. Until then the alert stays open.

## Ignored Vulnerabilities

### image-size

- **Vulnerability**: ICNS parser infinite-loop DoS and JXL/HEIF parser infinite-loop DoS (both high). No CVE patch exists — the advisories report **no patched version in any release**.
- **Current version**: 0.5.5
- **Reason for ignoring**: There is nothing to upgrade to; upstream has shipped no fix in any `image-size` version. The package is reached only through `less@4.2.0` (which requires `image-size@~0.5.0`), the CSS preprocessor used by the workflows frontend build. It is dev-only build tooling, is not present in any deployed service runtime, and never parses untrusted image input — the build only processes first-party stylesheets and assets from this repository. Alerts were dismissed as `tolerable_risk`.
- **Date**: 2026-09-14
- **Review again when**: `image-size` ships a patched release and `less` widens its `~0.5.0` range, or the workflows build stops depending on `less`

### deepmerge

- **Vulnerability**: GHSA-gcqx-w48m-w2h4 — `mergeObject()` allows prototype poisoning of returned objects (low). Affects `>=4.2.0 <=4.3.1`; **no patched version exists**.
- **Current version**: 4.2.2 (`formik@2.2.9` uses `deepmerge@2.2.1`, which is outside the vulnerable range)
- **Reason for ignoring**: Reached only through `fork-ts-checker-webpack-plugin@9.1.0`, a devDependency of `media-workflows` and `channel-workflows` that type-checks during the pilet build. Both `webpack.config.js` files instantiate it as `new ForkTsCheckerWebpackPlugin()` with no options, so `deepmerge` only merges the plugin's own defaults — no external input can reach it, and it is not part of any deployed service runtime or the shipped pilet bundle. There is nothing to upgrade to. Alert was dismissed as `tolerable_risk`.
- **Considered alternative**: drop the plugin and run `tsc --noEmit` before `pilet build` (piral's ts-loader is `transpileOnly`, so that would keep build-time type checking but lose live type errors in `pilet debug`). Not done, to keep this a dependency-only change.
- **Date**: 2026-11-04
- **Review again when**: `deepmerge` ships a patched release, or the workflows build drops `fork-ts-checker-webpack-plugin`
