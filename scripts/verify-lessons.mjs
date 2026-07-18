#!/usr/bin/env node
// Verify every lesson: the shipped starter must fail its tests (RED) and the
// reference solution in solutions/NN-slug/ must pass them (GREEN).
// Copies each lesson to a temp dir so the working tree is never touched.

import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const LESSONS = join(ROOT, 'lessons');
const SOLUTIONS = join(ROOT, 'solutions');

const lessons = existsSync(LESSONS)
  ? readdirSync(LESSONS, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  : [];

if (lessons.length === 0) {
  console.log('verify-lessons: no lessons yet');
  process.exit(0);
}

function runTests(dir) {
  const result = spawnSync('npx', ['vitest', 'run'], {
    cwd: dir,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return result.status === 0;
}

function stage(lesson) {
  const tmp = mkdtempSync(join(tmpdir(), `lesson-${lesson}-`));
  const dir = join(tmp, lesson);
  cpSync(join(LESSONS, lesson), dir, { recursive: true });
  symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'));
  return { tmp, dir };
}

let failed = false;
for (const lesson of lessons) {
  const solution = join(SOLUTIONS, lesson);
  if (!existsSync(solution)) {
    console.log(`${lesson}: FAIL (no solutions/${lesson}/)`);
    failed = true;
    continue;
  }

  const red = stage(lesson);
  const starterPasses = runTests(red.dir);
  rmSync(red.tmp, { recursive: true, force: true });

  const green = stage(lesson);
  cpSync(solution, green.dir, { recursive: true });
  const solutionPasses = runTests(green.dir);
  rmSync(green.tmp, { recursive: true, force: true });

  const starterVerdict = starterPasses ? 'FAIL (starter is green)' : 'PASS';
  const solutionVerdict = solutionPasses ? 'PASS' : 'FAIL (solution is red)';
  console.log(`${lesson}: starter red ${starterVerdict}`);
  console.log(`${lesson}: solution green ${solutionVerdict}`);
  if (starterPasses || !solutionPasses) failed = true;
}

process.exit(failed ? 1 : 0);
