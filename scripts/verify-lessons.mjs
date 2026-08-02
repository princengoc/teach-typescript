#!/usr/bin/env node
// Verify every lesson against its reference solution. Four criteria each:
// the mirror lines up with the lesson file for file, the shipped starter fails
// its tests (RED), the solution passes them with nothing skipped (GREEN), and
// the solution compiles -- drills included, which the lesson tsconfig leaves
// out on purpose so a fix-the-compiler drill fails tsc without failing the gate.
// Every lesson is copied to a temp dir, so the working tree is never touched.

import { spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const LESSONS = join(ROOT, 'lessons');
const SOLUTIONS = join(ROOT, 'solutions');
const DRILLS_TSCONFIG = 'tsconfig.drills.json';

const lessons = existsSync(LESSONS)
  ? readdirSync(LESSONS, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  : [];

if (lessons.length === 0) {
  console.log('verify-lessons: no lessons yet');
  process.exit(0);
}

function files(dir) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => relative(dir, join(e.parentPath, e.name)))
    .filter((f) => !f.startsWith('node_modules'));
}

function runTests(dir) {
  const result = spawnSync('npx', ['vitest', 'run'], {
    cwd: dir,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return result.status === 0;
}

function typechecks(dir, config) {
  const result = spawnSync('npx', ['tsc', '--noEmit', '-p', config], {
    cwd: dir,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  return result.status === 0;
}

function stage(lesson) {
  const tmp = mkdtempSync(join(tmpdir(), `lesson-${lesson}-`));
  const dir = join(tmp, lesson);
  cpSync(join(LESSONS, lesson), dir, {
    recursive: true,
    filter: (src) => !src.includes('node_modules'),
  });
  symlinkSync(join(ROOT, 'node_modules'), join(dir, 'node_modules'));
  return { tmp, dir };
}

// A drill the kid has finished must compile, so typecheck what the lesson
// tsconfig deliberately leaves out.
function compiles(dir) {
  if (!typechecks(dir, 'tsconfig.json')) return false;
  if (!existsSync(join(dir, 'drills'))) return true;
  writeFileSync(
    join(dir, DRILLS_TSCONFIG),
    '{ "extends": "./tsconfig.json", "include": ["drills"] }\n',
  );
  return typechecks(dir, DRILLS_TSCONFIG);
}

// The starter skips the drill tasks past the first; the solution unskips them,
// so a skip left in the mirror is a task nothing checked.
function skipped(dir) {
  return files(dir)
    .filter((f) => f.endsWith('.test.ts'))
    .filter((f) =>
      /\b(test|it|describe)\.skip\b/.test(readFileSync(join(dir, f), 'utf8')),
    );
}

function verdicts(lesson) {
  const solution = join(SOLUTIONS, lesson);
  if (!existsSync(solution)) {
    return [['mirror', `FAIL (no solutions/${lesson}/)`]];
  }

  const stray = files(solution).filter(
    (f) => !existsSync(join(LESSONS, lesson, f)),
  );

  const red = stage(lesson);
  const starterPasses = runTests(red.dir);
  rmSync(red.tmp, { recursive: true, force: true });

  const green = stage(lesson);
  cpSync(solution, green.dir, { recursive: true });
  const solutionPasses = runTests(green.dir);
  const left = skipped(green.dir);
  const solutionCompiles = compiles(green.dir);
  rmSync(green.tmp, { recursive: true, force: true });

  return [
    ['mirror', stray.length === 0 ? 'PASS' : `FAIL (not in lesson: ${stray})`],
    ['starter red', starterPasses ? 'FAIL (starter is green)' : 'PASS'],
    [
      'solution green',
      !solutionPasses
        ? 'FAIL (solution is red)'
        : left.length > 0
          ? `FAIL (skipped: ${left})`
          : 'PASS',
    ],
    [
      'solution compiles',
      solutionCompiles ? 'PASS' : 'FAIL (solution does not typecheck)',
    ],
  ];
}

let failed = false;
for (const lesson of lessons) {
  for (const [criterion, verdict] of verdicts(lesson)) {
    console.log(`${lesson}: ${criterion} ${verdict}`);
    if (verdict !== 'PASS') failed = true;
  }
}

process.exit(failed ? 1 : 0);
