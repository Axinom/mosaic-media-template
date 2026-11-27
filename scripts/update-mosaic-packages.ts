/* eslint-disable no-console */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as semver from 'semver';

interface YarnWorkspace {
  location: string;
}

interface YarnWorkspaces {
  [name: string]: YarnWorkspace;
}

type DistTagType = 'prerelease' | 'latest';

type PackageDistTags = {
  [tag in DistTagType]: string;
};

function runYarnCommand(args: string[], wsPath?: string): string {
  const stdout = execFileSync(
    process.platform === 'win32' ? 'yarn.cmd' : 'yarn',
    args,
    { cwd: wsPath },
  );

  return stdout.toString();
}

function getYarnWorkspaces(): YarnWorkspaces {
  const stdout = runYarnCommand(['workspaces', 'list', '--json']);
  const lines = stdout.trim().split('\n');
  const ws: YarnWorkspaces = {};

  for (const line of lines) {
    try {
      const workspace = JSON.parse(line);
      ws[workspace.name] = { location: workspace.location };
    } catch (error) {
      console.error(error);
    }
  }

  // adding the workspace root package
  ws.root = { location: '.' };
  return ws;
}

const MAX_ATTEMPTS = 3;
const distTagsCache = new Map<string, PackageDistTags>();

function sleep(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function getPackageDistTags(packageName: string): PackageDistTags {
  const cached = distTagsCache.get(packageName);
  if (cached) {
    return cached;
  }

  // Retry so that a transient registry or DNS error does not abort the run halfway.
  for (let attempt = 1; ; attempt++) {
    try {
      const stdout = runYarnCommand([
        'npm',
        'info',
        packageName,
        '--fields',
        'dist-tags',
        '--json',
      ]);
      const distTags = JSON.parse(stdout)['dist-tags'] as PackageDistTags;
      distTagsCache.set(packageName, distTags);
      return distTags;
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS) {
        throw error;
      }
      console.warn(
        ` |  failed to read dist-tags of ${packageName} (attempt ${attempt}/${MAX_ATTEMPTS}), retrying`,
      );
      sleep(attempt * 2000);
    }
  }
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function updateMosaicDeps(
  packageJson: PackageJson,
  dependencyType: 'dependencies' | 'devDependencies',
  tag: DistTagType,
): void {
  const depsObject = packageJson[dependencyType];
  if (!depsObject) {
    return;
  }

  const dependencies = Object.keys(depsObject);
  const mosaicDependencies = dependencies.filter((d) =>
    d.startsWith('@axinom/mosaic-'),
  );

  if (mosaicDependencies.length === 0) {
    return;
  }

  console.log(` | ${dependencyType}`);
  for (const packageName of mosaicDependencies) {
    const distTags = getPackageDistTags(packageName);
    const currentVersion = depsObject[packageName];
    // Never downgrade: a workspace may intentionally use a prerelease that is newer than
    // `latest` (e.g. `0.63.0-rc.11` while `latest` is `0.62.0`). Keep that version instead.
    const current = semver.validRange(currentVersion)
      ? semver.minVersion(currentVersion)
      : null;
    const target =
      current && semver.gt(current, distTags[tag])
        ? current.version
        : distTags[tag];
    // Mosaic libraries depend on each other with caret ranges. Using `^x.y.z-rc.n` instead of
    // `x.y.z-rc.n` resolves the workspaces to the same version as those libraries. Once `x.y.z`
    // is published, both resolve to `x.y.z` instead of one staying on `x.y.z-rc.n`.
    const newVersion = `^${target}`;
    if (currentVersion !== newVersion) {
      console.log(` |  ${packageName}@${currentVersion} > ${newVersion}`);
      depsObject[packageName] = newVersion;
    }
  }
}

interface PendingWrite {
  packageJsonPath: string;
  content: string;
}

function updatePackageJson(wsPath: string, tag: DistTagType): PendingWrite {
  const packageJsonPath = path.join(wsPath, 'package.json');
  const original = fs.readFileSync(packageJsonPath, 'utf-8');
  const packageJson = JSON.parse(original) as PackageJson;

  updateMosaicDeps(packageJson, 'dependencies', tag);
  updateMosaicDeps(packageJson, 'devDependencies', tag);

  // Keep the trailing newline the file had, so untouched lines don't show up in the diff.
  const trailingNewline = original.endsWith('\n') ? '\n' : '';
  return {
    packageJsonPath,
    content: JSON.stringify(packageJson, null, 2) + trailingNewline,
  };
}

/**
 * This script updates all `@axinom/mosaic-*` packages in all workspaces to the `prerelease` tag (by default).
 * It is also possible to use `latest`.
 */
function run(tag: DistTagType = 'prerelease'): void {
  const workspaces = getYarnWorkspaces();

  console.log('Bumping mosaic packages');
  // Resolve every version before writing anything, so a failed lookup leaves no
  // half-updated workspaces behind.
  const pendingWrites: PendingWrite[] = [];
  for (const [wsName, wsData] of Object.entries(workspaces)) {
    console.log(`${wsName}`);
    pendingWrites.push(updatePackageJson(wsData.location, tag));
  }
  for (const { packageJsonPath, content } of pendingWrites) {
    fs.writeFileSync(packageJsonPath, content);
  }
  console.log('Updating yarn.lock');
  runYarnCommand(['install']);
}

function main(): void {
  const argv = process.argv.slice(2);
  const tag: DistTagType = (argv[0] as DistTagType) ?? 'prerelease';

  run(tag);

  console.log('Done.');
}

main();
