#!/usr/bin/env node
// Typecheck every lesson that has its own tsconfig. Exits 0 when no lessons exist yet.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';

const LESSONS = 'lessons';
const dirs = existsSync(LESSONS)
  ? readdirSync(LESSONS, { withFileTypes: true })
      .filter(
        (e) =>
          e.isDirectory() && existsSync(`${LESSONS}/${e.name}/tsconfig.json`),
      )
      .map((e) => `${LESSONS}/${e.name}`)
  : [];

if (dirs.length === 0) {
  console.log('typecheck: no lessons yet');
  process.exit(0);
}

let failed = false;
for (const dir of dirs) {
  const result = spawnSync(
    'npx',
    ['tsc', '--noEmit', '-p', `${dir}/tsconfig.json`],
    {
      stdio: 'inherit',
    },
  );
  if (result.status !== 0) failed = true;
}
process.exit(failed ? 1 : 0);
