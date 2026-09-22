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
- **Last verified**: 2026-09-14
- **Commit**: `197ee4eb` — *"[AB#47252] fix: bumping several packages to address CVEs (#443)"*
- **Can be removed when**: `@asyncapi/multi-parser` drops its `@asyncapi/parser@2.x` / `3.0.0-next-major-spec.x` legacy parsers, or those releases update `jsonpath-plus` to `^10.x`

## Waiting for Upstream Fix

### ajv@5.x / 6.5.2

- **Vulnerability**: Prototype Pollution (medium, GHSA — patched 6.12.3), ReDoS via `$data` (medium)
- **Current versions**: 5.5.2, 6.5.2 (the `^6.12.4` / `^6.12.5` / `^8.x` consumers resolve to 6.14.0, 6.15.0 and 8.20.0 and are unaffected)
- **Patched in**: 6.12.3 (Prototype Pollution), 6.14.0 (ReDoS for 6.x) / 8.18.0 (ReDoS for 7.x+)
- **Blocked by**: `json-schema-migrate@0.2.0` requires `ajv@^5.0.0` (reached via `@axinom/mosaic-cli` → `@asyncapi/multi-parser` → `@asyncapi/parser@2.1.2` → `ramldt2jsonschema@1.2.3`); `webapi-parser@0.5.0` pins `ajv@6.5.2` exactly
- **Date**: 2026-02-23
- **Last verified**: 2026-09-14
- **Check again when**: `@asyncapi/multi-parser` drops the legacy `@asyncapi/parser@2.x` chain, or `webapi-parser` releases a version without the exact `6.5.2` pin

### lodash@4.17.23 via tilde ranges

- **Vulnerability**: Prototype Pollution via array path bypass in `_.unset`/`_.omit` (medium), Code Injection via `_.template` imports key names (high)
- **Current version**: 4.17.23
- **Patched in**: 4.18.0
- **Blocked by**: `@graphql-codegen/plugin-helpers@2.7.2` and `@5.0.3` use `~4.17.0`, and `@stoplight/spectral-functions@1.7.2` / `@stoplight/spectral-rulesets@1.18.1` use `~4.17.21` — tilde ranges cap at 4.17.x. The `^4.17.x` consumers already resolve to 4.18.1; only the tilde-range entry remains.
- **Date**: 2026-04-14
- **Last verified**: 2026-09-14
- **Check again when**: `@graphql-codegen/plugin-helpers` or `@stoplight/spectral-*` update their lodash range to `^4.18.0`

### serialize-javascript

- **Vulnerability**: RCE via `RegExp.flags` / `Date.prototype.toISOString` (high), CPU Exhaustion DoS via crafted array-like objects (medium)
- **Current version**: 6.0.2
- **Patched in**: 7.0.3 / 7.0.5
- **Blocked by**: `css-minimizer-webpack-plugin@5.0.1` requires `^6.0.1`. Only 5.0.0 and 5.0.1 exist for the 5.x line. Latest `css-minimizer-webpack-plugin` (7.x) uses `^7.0.3`, but `piral-cli-webpack5@1.5.3` requires `^5.0.1`.
- **Date**: 2026-03-03
- **Last verified**: 2026-09-14
- **Check again when**: `piral-cli-webpack5` updates its `css-minimizer-webpack-plugin` range

### immutable@~3.7.6

- **Vulnerability**: Prototype Pollution (high), Hash-collision algorithmic complexity DoS (high)
- **Current version**: 3.7.6
- **Patched in**: 3.8.3 / 3.8.4
- **Blocked by**: `@ardatan/relay-compiler@12.0.0` tilde-pins `immutable@~3.7.6` (allows only 3.7.x). `@graphql-tools/relay-operation-optimizer@7.1.3` uses `@ardatan/relay-compiler@^13.0.1` (fixed), but `@graphql-codegen/visitor-plugin-common@2.x` requires `^6.5.0` of relay-operation-optimizer. The `^4.0.0` consumers already resolve to the patched 4.3.9.
- **Date**: 2026-03-12
- **Last verified**: 2026-09-14
- **Check again when**: `@graphql-codegen/visitor-plugin-common` releases a v3+ that accepts `@graphql-tools/relay-operation-optimizer@^7`

### @faker-js/faker@7.6.0 (via @axinom/mosaic-ui)

- **Vulnerability**: `helpers.fake` exploitable into arbitrary code execution (high)
- **Current version**: 7.6.0
- **Patched in**: 10.5.0 (major-version jump)
- **Blocked by**: `@axinom/mosaic-ui@0.73.0` declares `@faker-js/faker@^7.4.0`, capping this copy at 7.x. `media-service` has already been migrated to `^10.5.0` (resolves to 10.6.0), so this is the only remaining vulnerable copy and it exists purely inside the Mosaic UI library. Forcing it with a resolution is not safe — it would push `@axinom/mosaic-ui` onto the v10 API, whose module renames (`name.*` → `person.*`, `datatype.*` → `number.*`/`string.*`, `random.*` → `word.*`) are breaking.
- **Date**: 2026-09-14
- **Check again when**: `@axinom/mosaic-ui` widens its `@faker-js/faker` range to `^10`

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
- **Last verified**: 2026-09-14
- **Next step / done when**: Bump the `@axinom/mosaic-*` libraries (and other consumers) so they accept `uuid@^11`, then drop any need for a resolution. Until then the alert stays open.

### tmp

- **Vulnerability**: Arbitrary temp file/dir write via symlink `dir` parameter (low); path traversal via unsanitized prefix/postfix (high)
- **Current version**: 0.0.33
- **Patched in**: 0.2.4 / 0.2.6 — both major-line jumps with API changes
- **Why deferred**: `tmp@0.0.33` is dev-only — pulled solely via `external-editor@3.1.0` (`@graphql-codegen/cli` → `inquirer@8`), not present in any deployed service runtime. `external-editor@3.1.0` (latest, unreleased since) pins `tmp@^0.0.33`; reaching 0.2.6 needs either a forced resolution that risks breaking `external-editor`'s use of the old `tmp` API, or migrating off the `inquirer@8` toolchain. Worth doing eventually, so the alert stays open.
- **Date**: 2026-06-09
- **Last verified**: 2026-09-14
- **Next step / done when**: `external-editor` releases a version with an updated `tmp` dep, `@graphql-codegen/cli` stops depending on `inquirer@8`, or a vetted forced resolution to `tmp@^0.2.6` is confirmed safe for `external-editor`.

## Ignored Vulnerabilities

### image-size

- **Vulnerability**: ICNS parser infinite-loop DoS and JXL/HEIF parser infinite-loop DoS (both high). No CVE patch exists — the advisories report **no patched version in any release**.
- **Current version**: 0.5.5
- **Reason for ignoring**: There is nothing to upgrade to; upstream has shipped no fix in any `image-size` version. The package is reached only through `less@4.2.0` (which requires `image-size@~0.5.0`), the CSS preprocessor used by the workflows frontend build. It is dev-only build tooling, is not present in any deployed service runtime, and never parses untrusted image input — the build only processes first-party stylesheets and assets from this repository. Alerts were dismissed as `tolerable_risk`.
- **Date**: 2026-09-14
- **Review again when**: `image-size` ships a patched release and `less` widens its `~0.5.0` range, or the workflows build stops depending on `less`
