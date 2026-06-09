---
name: fix-vulnerabilities
description: Scan for and fix vulnerable npm dependencies in this Yarn Berry monorepo by updating the yarn.lock file. Use when user asks to fix vulnerabilities, run security audit, or update vulnerable dependencies.
allowed-tools: Bash(yarn:*), Bash(npm:*), Bash(grep:*), Bash(gh:*), Bash(python3:*), Read, Edit, Write, Glob, Grep, AskUserQuestion
---

# Fix Vulnerable Dependencies

GitHub Dependabot is the **source of truth** for vulnerabilities. It uses the GitHub Advisory Database (GHAD), which is more comprehensive than the npm advisory database queried by `yarn npm audit`. Always work from the Dependabot alert list.

## Context

This is a Yarn 4 (Berry) monorepo with multiple workspaces under `services/*/*` and `libs/*`. The lockfile format uses `resolution:`, `checksum:`, `languageName:`, and `linkType:` fields. All dependency resolutions are centralized in the root `yarn.lock`.

## Procedure

### 1. Check existing resolutions for removal opportunities

Before scanning for new vulnerabilities, check if any existing resolutions in `RESOLUTIONS.md` can be removed:

1. Read `RESOLUTIONS.md` if it exists
2. For each **Active Resolution**: check if the forced version is now satisfied naturally by the parent's semver range (`yarn why <package-name>`). If so, remove the resolution from root `package.json`, remove the entry from `RESOLUTIONS.md`, and run `yarn install`.
3. For each **Waiting for Upstream** entry: check if the blocking parent package has released a new version that fixes the issue (verify via Dependabot alerts in step 3). If so, remove the entry and proceed with a normal lockfile fix.
4. For each **Deferred (Tolerated For Now)** entry: check whether its "Next step / done when" condition is now met (e.g. the `@axinom/mosaic-*` bump in step 2 widened the range). If so, fix it and remove the entry. These alerts are kept open in Dependabot, so they will reappear in step 3 — that is expected; do not re-triage them from scratch, just re-check the done-when condition.

The goal is to minimize resolutions and return to normal dependency resolution when possible.

### 2. Update Axinom Mosaic packages first

Before scanning, update all `@axinom/mosaic-*` dependencies to the latest released versions. This is the primary way to get upstream fixes from Mosaic:

```bash
yarn util:update-mosaic-packages latest
```

This script updates all `@axinom/mosaic-*` packages across all workspaces and regenerates `yarn.lock`.

### 3. Fetch open Dependabot alerts

```bash
gh api "/repos/$(gh repo view --json nameWithOwner -q .nameWithOwner)/dependabot/alerts?state=open&per_page=100" \
  --jq '.[] | {number: .number, package: .dependency.package.name, severity: .security_vulnerability.severity, vulnerable_range: .security_vulnerability.vulnerable_version_range, patched_in: .security_vulnerability.first_patched_version.identifier, summary: .security_advisory.summary}'
```

This gives the full list of open alerts including severity, vulnerable version range, and the first patched version. Work through all open alerts.

As a secondary check, also run:

```bash
yarn npm audit --all --recursive
```

The `--all` flag includes all workspaces in the monorepo.

### 4. For each vulnerable transitive dependency

First, group alerts by their root parent to find common causes — multiple alerts often share the same parent. Check if the patched version falls within the semver range requested by parent packages:

```bash
# Find where the package is used across workspaces
yarn why <package-name>

# Check the lockfile entry and its current semver selector
grep -n "^\"<package-name>@" yarn.lock
```

Look for patterns: if multiple vulnerable packages all trace back to the same parent, fixing the parent in one step may resolve all of them.

### 5. Update lockfile entries

**Do NOT manually patch `checksum:`, `version:`, or `resolution:` values** — the Berry checksum format is not an npm integrity hash and cannot be sourced from `npm view`. Instead, delete the entry and let Yarn re-resolve it.

1. **Delete the lockfile entry** for the vulnerable package. **Match by the exact header line, not by hardcoded line numbers** — line-number arithmetic is error-prone (an off-by-one can delete the *next* entry's header and silently merge two packages into one corrupt entry, which breaks the install/build in non-obvious ways). The snippet below finds each entry by its full header string and deletes from the header through the trailing blank line:

```python
python3 << 'EOF'
lockfile = "yarn.lock"
with open(lockfile) as f:
    lines = f.readlines()

# Paste the FULL header line(s) exactly as they appear in yarn.lock,
# including quotes, all comma-joined selectors, the trailing ":" and "\n".
# Get them with:  grep -nE '^"?<package>@npm' yarn.lock
targets = [
    '"ws@npm:^8.12.0, ws@npm:^8.13.0, ws@npm:^8.15.0":\n',
    '"postcss@npm:^8.0.0, postcss@npm:^8.4.4":\n',
]

ranges = []
for t in targets:
    if t not in lines:
        print("NOT FOUND (check exact header):", t.strip()); continue
    i = lines.index(t)            # header line index (0-based)
    j = i + 1
    while j < len(lines) and lines[j].strip() != "":  # walk to the blank line
        j += 1
    ranges.append((i, j + 1))     # j+1 = exclusive end, includes trailing blank
    print(f"deleting {t.strip()[:60]}  ({i+1}..{j+1})")

for (i, end) in sorted(ranges, reverse=True):  # reverse so indices stay valid
    del lines[i:end]

with open(lockfile, 'w') as f:
    f.writelines(lines)
EOF
```

2. **Run `yarn install --no-immutable`** — Yarn re-resolves to the latest satisfying version and computes the correct checksum automatically.

Multiple entries can be deleted in one pass (the snippet handles reverse-order deletion). Yarn will re-resolve all of them in a single `install` run. **After reinstalling, sanity-check that no entries were merged** — e.g. `grep -nE '^"?<pkg>@npm' yarn.lock` should still show each package as its own header, and a quick `yarn build` catches corruption early.

**Note:** `yarn up <package>` only works for direct dependencies — not usable for transitive packages. For transitive packages, always use the delete-and-reinstall approach.

### 6. Handle dependency changes

When removing a lockfile entry, Yarn automatically resolves correct transitive dependencies for the new version. No manual dependency block editing needed.

### 6a. Consider updating parent packages to fix transitive vulnerabilities

Before adding resolutions for a stuck transitive dependency, check if the **parent packages** have released new versions that already fix the issue:

```bash
# Check if the parent has a newer version with an updated dep range
npm view <parent-package>@latest dependencies --json | grep <vulnerable-package>

# Check if the vulnerable package's dep was removed in a newer parent version
npm view <parent-package>@latest version
```

Examples of what to look for:
- A parent pinning `qs@6.13.0` exactly → check if a newer parent version uses `qs@~6.14.0`
- A parent using `tar@^6` → check if a newer version uses `tar@^7` or removed the dep
- A direct dependency with a transitive chain → updating the direct dep may fix multiple alerts at once

If the parent has been updated, delete the parent's lockfile entry (or update it as a direct dependency) rather than adding a resolution for the transitive package.

**When a package uses `npm:latest` as its version selector** (e.g., `"node-gyp@npm:latest"` in the lockfile), deleting that entry and running `yarn install` will resolve to whatever is currently "latest" on the registry. This is safe and often the right move when the latest version of that package has fixed its vulnerable transitive deps.

### 7. Validate and verify

```bash
# Validate lockfile and regenerate checksums
yarn install

# Local audit check (npm advisory database — may show fewer findings than Dependabot)
yarn npm audit --all --recursive

# Build to ensure nothing broke
yarn build

# Run tests to catch regressions
yarn test
```

Note: Dependabot auto-dismisses alerts once it detects the vulnerability is gone (on the next scan). No manual dismissal needed for fixed alerts.

### 8. Unfixable vulnerabilities

Some vulnerabilities cannot be fixed via lockfile updates:
- **Exact pins**: When a parent uses `package: "1.2.3"` instead of `^1.2.3`
- **Breaking changes**: When the patch is in a new major version
- **Upstream not updated**: Parent package hasn't updated its dependency range

For these, **ask the user** using AskUserQuestion before taking action. Offer these options:

**Option A: Add a resolution (requires user approval)**
- Use yarn `resolutions` in root `package.json` to force the patched version
- Document the resolution in `RESOLUTIONS.md` (see section 9)

**Option B: Defer — tolerate for now, keep the alert open**
- The user wants to fix it eventually but the fix is bigger/involved work (e.g. a major-version migration that needs upstream coordination, like bumping `@axinom/mosaic-*` ranges). This also fits cases where "waiting for upstream" doesn't apply because the package itself is deprecated and the project genuinely needs to move off it.
- **Do NOT dismiss the Dependabot alert** — leave it open as a tracking reminder.
- Document under "Deferred (Tolerated For Now)" in `RESOLUTIONS.md` with the concrete next step / done-when condition.

**Option C: Ignore — accept the risk permanently**
- The vulnerability is not relevant to this project (e.g. an unreachable code path, dev-only tooling not in any deployed runtime) and there is no intent to fix it.
- Document under "Ignored Vulnerabilities" in `RESOLUTIONS.md`.
- Dismiss the Dependabot alert: `gh api --method PATCH /repos/$(gh repo view --json nameWithOwner -q .nameWithOwner)/dependabot/alerts/<number> -f state=dismissed -f dismissed_reason=tolerable_risk -f dismissed_comment="<reason>"`

**Option D: Wait for upstream fix**
- No action taken and no intent to force anything — a parent package simply needs to release an updated dependency range. Document under "Waiting for Upstream" so it isn't re-examined from scratch next run. Leave the alert open.

The difference between **Defer** and **Wait for upstream**: *Defer* is "we own this, it's on our backlog as non-trivial work"; *Wait for upstream* is "we're blocked on someone else releasing and there's nothing for us to do but check back". Both keep the alert open. **Ignore** is the only option that dismisses the alert.

### 9. Document resolutions

When a resolution is added to root `package.json`, or a vulnerability is deferred/ignored/waiting, create or update `RESOLUTIONS.md` with the following format.

**Do NOT reference Dependabot alert IDs** (`#123`) anywhere in `RESOLUTIONS.md` — those numbers are only meaningful to people with access to this repo's Dependabot alerts, and they churn. Identify vulnerabilities by package name + CVE/GHSA ID + a short description instead.

```markdown
# Dependency Resolutions

This file documents forced dependency resolutions and their reasons.
The goal is to minimize resolutions and remove them when no longer needed.

## Active Resolutions

### <package-name>

- **Forced version**: `<version>`
- **Reason**: <vulnerability CVE/GHSA or description>
- **Parent packages**: <which packages depend on this>
- **Original selector**: `<semver-range>` (e.g., `^1.1.7`)
- **Date added**: <YYYY-MM-DD>
- **Can be removed when**: <condition, e.g., "parent-package updates to >=2.0.0">

## Deferred (Tolerated For Now)

Vulnerabilities we intend to fix eventually, but where the fix is bigger/involved
work. The Dependabot alert is intentionally kept **open** as a tracking reminder.

### <package-name>

- **Vulnerability**: <CVE/GHSA or description>
- **Current versions**: <versions in tree>
- **Patched in**: <version> (note if it's a major-version jump)
- **Why deferred**: <why it's low-risk for now AND why the fix is non-trivial>
- **Date**: <YYYY-MM-DD>
- **Next step / done when**: <the concrete work that closes this, e.g. "bump @axinom/mosaic-* to accept uuid@^11">

## Ignored Vulnerabilities

### <package-name>

- **Vulnerability**: <CVE/GHSA or description>
- **Reason for ignoring**: <why it's irrelevant to this project — alert was dismissed>
- **Date**: <YYYY-MM-DD>
- **Review again when**: <condition or date>

## Waiting for Upstream Fix

### <package-name>

- **Vulnerability**: <CVE/GHSA or description>
- **Blocked by**: <parent-package> needs to update its dependency range
- **Date**: <YYYY-MM-DD>
- **Check again when**: <parent-package> releases a new version
```

This documentation enables step 1 to check whether resolutions can be removed.

## Do NOT

- Add vulnerable packages as direct dependencies just to "upgrade" them (doesn't fix transitive deps)
- Use `yarn add <package>` for transitive dependencies (adds them as direct deps)
- Manually patch `checksum:`, `version:`, or `resolution:` values in a Yarn Berry lockfile — the checksum format is not an npm integrity hash and cannot be sourced from `npm view`. Always delete the entry and let `yarn install --no-immutable` regenerate it correctly.
- Use `yarn up <package>` for transitive packages — it only works on direct deps
- Modify individual workspace `package.json` files unless the vulnerability is in a direct dependency of that workspace
- Add resolutions without asking the user first
- Add resolutions without documenting them in `RESOLUTIONS.md`
- Manually dismiss Dependabot alerts for fixed vulnerabilities (Dependabot does this automatically)
- Dismiss a Dependabot alert when the user chose **Defer** or **Wait for upstream** — only **Ignore** dismisses; the others keep the alert open
- Reference Dependabot alert IDs (`#123`) in `RESOLUTIONS.md` — they're only meaningful with repo Dependabot access; use package name + CVE/GHSA + description instead
- Delete lockfile entries by hardcoded line numbers — match the exact header string (an off-by-one merges adjacent entries and corrupts the lockfile)
