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

1. **Delete the lockfile entry** for the vulnerable package:

```python
# Find the entry's line range with:
# grep -n "^\"<package>@npm:" yarn.lock
# Then delete that range (start line to blank line inclusive):
python3 << 'EOF'
lockfile = "yarn.lock"
with open(lockfile) as f:
    lines = f.readlines()
# Delete in reverse order if removing multiple entries
del lines[START-1:END]  # 1-indexed, inclusive of trailing blank line
with open(lockfile, 'w') as f:
    f.writelines(lines)
EOF
```

2. **Run `yarn install --no-immutable`** — Yarn re-resolves to the latest satisfying version and computes the correct checksum automatically.

Multiple entries can be deleted in one pass (process ranges in reverse order to preserve line numbers). Yarn will re-resolve all of them in a single `install` run.

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

For these, **ask the user** using AskUserQuestion before taking action:

**Option A: Add a resolution (requires user approval)**
- Use yarn `resolutions` in root `package.json` to force the patched version
- Document the resolution in `RESOLUTIONS.md` (see section 9)

**Option B: Ignore the vulnerability**
- User accepts the risk for now
- Document the decision and reason in `RESOLUTIONS.md` under "Ignored Vulnerabilities"
- Dismiss the Dependabot alert: `gh api --method PATCH /repos/$(gh repo view --json nameWithOwner -q .nameWithOwner)/dependabot/alerts/<number> -f state=dismissed -f dismissed_reason=tolerable_risk -f dismissed_comment="<reason>"`

**Option C: Wait for upstream fix**
- No action taken now, but document it in `RESOLUTIONS.md` under "Waiting for Upstream" so it isn't re-examined from scratch next run

### 9. Document resolutions

When a resolution is added to root `package.json`, create or update `RESOLUTIONS.md` with the following format:

```markdown
# Dependency Resolutions

This file documents forced dependency resolutions and their reasons.
The goal is to minimize resolutions and remove them when no longer needed.

## Active Resolutions

### <package-name>

- **Forced version**: `<version>`
- **Reason**: <vulnerability CVE or description>
- **Parent packages**: <which packages depend on this>
- **Original selector**: `<semver-range>` (e.g., `^1.1.7`)
- **Date added**: <YYYY-MM-DD>
- **Can be removed when**: <condition, e.g., "parent-package updates to >=2.0.0">

## Ignored Vulnerabilities

### <package-name>

- **Vulnerability**: <CVE or description>
- **Reason for ignoring**: <explanation>
- **Date**: <YYYY-MM-DD>
- **Review again when**: <condition or date>

## Waiting for Upstream Fix

### <package-name>

- **Vulnerability**: <CVE or description>
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
