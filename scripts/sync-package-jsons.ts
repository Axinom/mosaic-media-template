/* eslint-disable no-console */
// Based on https://gist.github.com/bartvanandel/0418571bad30a3199afdaa1d5e3dbe25

import * as fs from 'fs';
import glob from 'glob';
import path from 'path';

/**
 * Removes matching outer quotes from a string.
 *
 * @param {string} text - String to unquote
 * @returns {string} - Unquoted string
 */
const unquote = (text: string): string => /(["'])?(.*)\1/.exec(text)?.[2] ?? '';

/**
 * @typedef {object} YarnLockItem
 * @property {string[]} pkgs - Array of package version specs, e.g. "yippee-ki-yay@^1.23.45", "@foo/bar@^1.6.0"
 * @property {string} version - Installed version
 * @property {string} resolved - Resolved package URL
 * @property {string} integrity - Package integrity
 * @property {object.<string, string>} dependencies - Package dependencies and their version specs
 */
interface YarnLockItem {
  pkgs: string[];
  version: string;
  resolved: string;
  dependencies: Record<string, string>;
}

/**
 * Extracts information about installed packages from yarn.lock file.
 *
 * NB: functionality for parsing a yarn.lock file exists in a package called `@yarnpkg/lockfile`,
 * however this package pulls in way too many dependencies (all of yarn, it seems).
 *
 * @param {string} filename - Path to yarn.lock file
 * @returns {object.<string, YarnLockItem>} Installed package information, keyed by package version spec
 */
const parseYarnLockFile = (s: string): Record<string, YarnLockItem> => {
  const lines = s.replace(/\r/g, '').split(/\n/);

  const entries: Record<string, YarnLockItem> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let entry: any;
  let key: string | number;

  lines.forEach((line) => {
    const indent = /^(\s*)/.exec(line)?.[1].length;
    line = line.trim();

    if (line === '') {
      if (entry) {
        // Add an entry for each of the package specs in the item
        entry.pkgs.forEach((pkg: string) => {
          entries[pkg] = entry;
        });
        entry = null;
      }
    } else if (line[0] === '#') {
      // Comment, skip
    } else if (indent === 0) {
      // Start of entry
      entry = {
        // Remove trailing colon, split, trim and unquote
        pkgs: line
          .replace(/:$/, '')
          .split(',')
          .map((s) => unquote(s.trim())),
      };
    } else if (indent === 2) {
      let match;
      if ((match = /^(\w+) (.+)/.exec(line))) {
        entry[match[1]] = unquote(match[2]);
      } else if ((match = /^(\w+):$/.exec(line))) {
        key = match[1];
        entry[key] = {};
      }
    } else if (indent === 4) {
      const match = /^(.+) (.+)/.exec(line);
      if (match) {
        entry[key][unquote(match[1])] = unquote(match[2].trim());
      }
    } else {
      console.warn('Line not understood:', line);
    }
  });

  return entries;
};

const updatePackageJson = (
  packageJson: { [x: string]: Record<string, string> },
  yarnLock: Record<string, YarnLockItem>,
): number => {
  let changeCount = 0;

  const updateSection = (sectionName: string): void => {
    console.log('Updating', sectionName, '...');

    const section = packageJson[sectionName];

    Object.entries(section).forEach(([pkg, versionSpec]) => {
      const dependency = `${pkg}@${versionSpec}`;

      // Get the version spec prefix, e.g. '^' or '>=', or none.
      // We support version specs containing a single semver, other types of version spec are untested a.t.m.
      // (version spec format is documented here: https://docs.npmjs.com/files/package.json#dependencies)
      const versionSpecPrefix = /^([^\d]*)/.exec(versionSpec)?.[1];

      const yarnLockEntry = yarnLock[dependency];
      if (yarnLockEntry) {
        const actualVersion = yarnLockEntry.version;
        const actualVersionSpec = `${versionSpecPrefix}${actualVersion}`;

        if (actualVersionSpec !== versionSpec) {
          console.log('  Updating:', dependency, '=>', actualVersionSpec);
          section[pkg] = actualVersionSpec;
          ++changeCount;
        } else {
          console.log('  Up-to-date:', dependency);
        }
      } else {
        console.warn('  !!! Missing yarn.lock entry for:', dependency);
      }
    });

    console.log('  Done.');
  };

  [
    'dependencies',
    'devDependencies',
    'optionalDependencies',
    'peerDependencies',
  ].forEach((sectionName) => {
    if (sectionName in packageJson) {
      updateSection(sectionName);
    }
  });

  return changeCount;
};

const main = (): void => {
  console.log('Reading yarn.lock ...');
  const yarnLockFile = fs.readFileSync('yarn.lock', 'utf8');
  const yarnLock = parseYarnLockFile(yarnLockFile);

  glob(
    '**/package.json',
    { ignore: ['**/node_modules/**'] },
    (_err, matches) => {
      matches.forEach((file) => {
        console.log(`Reading ${file} ...`);
        const packageJsonFile = fs.readFileSync(file, 'utf8');
        const packageJson = JSON.parse(packageJsonFile);

        const changeCount = updatePackageJson(packageJson, yarnLock);

        if (changeCount > 0) {
          const outFilename = `${path.dirname(file)}/package.json`;
          console.log('Writing changes to:', outFilename);
          fs.writeFileSync(outFilename, JSON.stringify(packageJson, null, 2));
        } else {
          console.log('No changes');
        }
      });
    },
  );
};

main();
