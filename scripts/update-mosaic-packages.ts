/* eslint-disable no-console */
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

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

function getPackageDistTags(packageName: string): PackageDistTags {
  const stdout = runYarnCommand([
    'npm',
    'info',
    packageName,
    '--fields',
    'dist-tags',
    '--json',
  ]);
  const info = JSON.parse(stdout);
  return info['dist-tags'] as PackageDistTags;
}

function updateMosaicDeps(
  packageJson: any,
  dependencyType: 'dependencies' | 'devDependencies',
  tag: DistTagType,
): void {
  const dependencies = Object.keys(packageJson[dependencyType] ?? {});
  const mosaicDependencies = dependencies.filter((d) =>
    d.startsWith('@axinom/mosaic-'),
  );

  if (mosaicDependencies.length === 0) {
    return;
  }

  console.log(` | ${dependencyType}`);
  for (const packageName of mosaicDependencies) {
    const distTags = getPackageDistTags(packageName);
    const currentVersion = packageJson[dependencyType][packageName];
    const newVersion = distTags[tag];
    if (currentVersion !== newVersion) {
      console.log(` |  ${packageName}@${currentVersion} > ${newVersion}`);
      packageJson[dependencyType][packageName] = newVersion;
    }
  }
}

function updatePackageJson(wsPath: string, tag: DistTagType): void {
  const packageJsonPath = path.join(wsPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  updateMosaicDeps(packageJson, 'dependencies', tag);
  updateMosaicDeps(packageJson, 'devDependencies', tag);

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

/**
 * This script updates all `@axinom/mosaic-*` packages in all workspaces to the `prerelease` tag (by default).
 * It is also possible to use `latest`.
 */
function run(tag: DistTagType = 'prerelease'): void {
  const workspaces = getYarnWorkspaces();

  console.log('Bumping mosaic packages');
  for (const [wsName, wsData] of Object.entries(workspaces)) {
    console.log(`${wsName}`);
    updatePackageJson(wsData.location, tag);
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
