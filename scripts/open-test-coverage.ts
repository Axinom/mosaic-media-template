import { exec } from 'child_process';
import { resolve } from 'path';

const url = resolve(
  __dirname,
  '../',
  process.argv[3] ?? '',
  'coverage/lcov-report/index.html',
);
const start =
  process.platform === 'darwin'
    ? 'open'
    : process.platform === 'win32'
    ? 'start'
    : 'xdg-open';
exec(`${start} ${url}`);
