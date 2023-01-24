import chalk from 'chalk';
import { execSync } from 'child_process';
import * as fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import * as semver from 'semver';

/** name of the package to check for */
const packageName = process.argv[2] || '@axinom/mosaic-portal';
/** base folder to look for package.json files */
const baseFolder = process.argv[3] || 'services';
/** glob pattern to look for package.json files */
const packageJsonGlob = process.argv[4] || '**/workflows/package.json';

const message = chalk.red(`A newer version %s of ${packageName} is available!
Your current version is: %s
Please run "pilet upgrade" in "%s" to update.`);

/**
 * Compares latest version of package from npm registry with package.json files.
 * It outputs message to update package if local version is older.
 */
async function checkPackageVersion(): Promise<void> {
  let latestVersion = '';
  try {
    latestVersion = execSync(`yarn info ${packageName} version`)
      .toString()
      .trim();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const packageJsonPaths = await new Promise<string[]>((resolve, reject) => {
    glob(path.join(baseFolder, packageJsonGlob), (error, files) =>
      error ? reject(error) : resolve(files),
    );
  });

  for (const packageJsonPath of packageJsonPaths) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    if (dependencies[packageName] || devDependencies[packageName]) {
      const localVersion =
        dependencies[packageName] || devDependencies[packageName];

      if (localVersion && semver.gt(latestVersion, localVersion)) {
        // eslint-disable-next-line no-console
        console.log(
          message,
          latestVersion,
          localVersion,
          packageJsonPath.replace('/package.json', ''),
        );
      }
    }
  }
}

checkPackageVersion();
