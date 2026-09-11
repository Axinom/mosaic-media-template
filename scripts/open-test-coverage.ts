import { execFile } from 'child_process';
import { resolve } from 'path';

const url = resolve(
  __dirname,
  '../',
  process.argv[3] ?? '',
  'coverage/index.html', // Vitest's default v8/html coverage reporter writes here (Jest wrote coverage/lcov-report/index.html)
);
const start =
  process.platform === 'darwin'
    ? 'open'
    : process.platform === 'win32'
      ? 'start'
      : 'xdg-open';
execFile(start, [url]);
