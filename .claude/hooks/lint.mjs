#!/usr/bin/env node
// PostToolUse linter: strip emoji from any edited file, biome-fix TS/JS/JSON, and report
// remaining biome errors to the agent via exit code 2.

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const EMOJI =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F0FF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu;

function stripEmoji(path) {
  const text = readFileSync(path, 'utf8');
  const cleaned = text.replace(EMOJI, '');
  if (cleaned !== text) {
    writeFileSync(path, cleaned);
    return true;
  }
  return false;
}

function main() {
  const event = JSON.parse(readFileSync(0, 'utf8'));
  const path = event?.tool_input?.file_path;
  if (!path || !existsSync(path) || !statSync(path).isFile()) return 0;

  const problems = [];
  if (stripEmoji(path)) problems.push(`stripped emoji from ${path}`);

  if (/\.(ts|tsx|js|jsx|mjs|cjs|json)$/.test(path)) {
    const fix = spawnSync('biome', ['check', '--write', path], {
      encoding: 'utf8',
    });
    if (fix.error?.code !== 'ENOENT') {
      stripEmoji(path);
      const check = spawnSync('biome', ['check', path], { encoding: 'utf8' });
      if (check.status !== 0) {
        problems.push(`${check.stdout ?? ''}${check.stderr ?? ''}`.trim());
      }
    }
  }

  if (problems.length) {
    process.stderr.write(`${problems.join('\n').trim()}\n`);
    return 2;
  }
  return 0;
}

process.exit(main());
