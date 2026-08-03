#!/usr/bin/env node
// Build each lesson's kit reference from the lesson's own code.
//
// A lesson hands the kid three things: the robot facade in src/harness/robot.ts,
// the ready-made moves in src/harness/moves.ts, and the numbers on the Room in
// src/harness/types.ts. Those files are the only source; this script reads their
// signatures and the `//` line above each one, and writes two derived things:
//
//   lessons/NN-slug/kit.md          the full kit, rendered by the preview
//   src/exercise.ts, between the    the signatures alone, where the kid types
//   `--- your kit ---` markers
//
// Run with --check to fail when either is stale, which is what npm run check
// does. Nothing here is hand-maintained: change a comment in the harness and
// the kit follows.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const LESSONS = join(ROOT, 'lessons');
const SOLUTIONS = join(ROOT, 'solutions');
const START = '// --- your kit ---';
const END = '// --- end of your kit ---';

const check = process.argv.includes('--check');

function read(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : null;
}

// The `//` lines directly above a declaration are its documentation. Blank
// lines and code end the block, so a comment about the file above does not
// become a comment about the first entry under it.
function docAbove(lines, index) {
  const doc = [];
  for (let i = index - 1; i >= 0; i -= 1) {
    const line = (lines[i] ?? '').trim();
    if (!line.startsWith('//')) break;
    doc.unshift(line.replace(/^\/\/\s?/, ''));
  }
  return doc.join(' ').trim();
}

// A doc may open with the rung it belongs to. The kit page keeps that; the one
// line in the exercise file wants the sentence after it.
function firstSentence(text) {
  const body = text.replace(/^RUNG \d+\.\s*/, '');
  const stop = body.search(/\.(\s|$)/);
  const sentence = stop === -1 ? body : body.slice(0, stop);
  const head = sentence.split(' ')[0] ?? '';
  if (head.length > 1 && head === head.toUpperCase()) return sentence;
  return sentence.charAt(0).toLowerCase() + sentence.slice(1);
}

function entriesFrom(lines, pattern, shape) {
  const entries = [];
  lines.forEach((line, index) => {
    const match = pattern.exec(line);
    if (!match) return;
    entries.push({ ...shape(match), doc: docAbove(lines, index) });
  });
  return entries;
}

// The kid types `robot.walk(1)`, not a type annotation, so the kit shows the
// parameter names alone.
function names(params) {
  return params
    .split(',')
    .map((param) => param.split(':')[0]?.trim() ?? '')
    .filter((param) => param !== '')
    .join(', ');
}

// robot.paint(), robot.walk(steps) -- the methods of the facade the kid calls.
function robotEntries(source) {
  if (!source) return [];
  const body = /export const robot = \{\n([\s\S]*?)\n\};/.exec(source);
  if (!body) return [];
  const lines = (body[1] ?? '').split('\n');
  return entriesFrom(
    lines,
    /^ {2}(\w+)\(([^)]*)\): (\w+(?:\[\])?) \{$/,
    (m) => ({ call: `robot.${m[1]}(${names(m[2] ?? '')})`, returns: m[3] }),
  );
}

// The moves a lesson hands over ready-made. Only the exported ones: a helper
// the kid cannot import is not part of the kit.
function moveEntries(source) {
  if (!source) return [];
  const lines = source.split('\n');
  return entriesFrom(
    lines,
    /^export function (\w+)\(([^)]*)\): (\w+(?:\[\])?) \{$/,
    (m) => ({ call: `${m[1]}(${names(m[2] ?? '')})`, returns: m[3] }),
  );
}

// The numbers the room hands the kid's code, one field at a time.
function roomEntries(source) {
  if (!source) return [];
  const body = /export interface Room \{\n([\s\S]*?)\n\}/.exec(source);
  if (!body) return [];
  const lines = (body[1] ?? '').split('\n');
  return entriesFrom(lines, /^ {2}(\w+): ([\w[\]]+);$/, (m) => ({
    call: `room.${m[1]}`,
    returns: m[2],
  }));
}

// The robot belongs on the page only when the kid's file can reach it. From
// lesson 08 the moves are the whole kit, and the robot is behind them.
function importsRobot(source) {
  return /^import \{[^}]*\brobot\b[^}]*\} from/m.test(source ?? '');
}

// The page and the provenance ask different questions. `robot` is what this
// lesson puts in front of the kid; `robotAll` is what the lesson has, reachable
// or not. Lesson 11 hands the robot back after three lessons behind the moves,
// and it never went anywhere, so it reads `since lesson 02` and not `back from`.
function readKit(dir) {
  const harness = join(dir, 'src', 'harness');
  const exercise = read(join(dir, 'src', 'exercise.ts'));
  const robot = robotEntries(read(join(harness, 'robot.ts')));
  return {
    moves: moveEntries(read(join(harness, 'moves.ts'))),
    robot: importsRobot(exercise) ? robot : [],
    robotAll: robot,
    room: roomEntries(read(join(harness, 'types.ts'))),
  };
}

// The moves the kid writes this lesson: the exercise exports them, the harness
// has stopped handing them over, and another lesson hands them over still.
function ownEntries(source) {
  if (!source) return [];
  const lines = source.split('\n');
  return entriesFrom(
    lines,
    /^export function (\w+)\(([^)]*)\): (\w+(?:\[\])?) \{$/,
    (m) => ({ call: `${m[1]}(${names(m[2] ?? '')})`, returns: m[3] }),
  );
}

function nameOf(call) {
  return call.slice(0, call.indexOf('('));
}

function lessonNumber(slug) {
  return slug.split('-')[0];
}

// Which lists count as having an entry, per section. A move the kid wrote
// themselves is a move they have, so lesson 11 does not break the spine for
// lesson 12; and the robot's provenance is read from every lesson's robot.ts,
// not from the three lessons that keep it behind the moves.
const PRESENCE = {
  moves: ['moves', 'own'],
  robot: ['robotAll'],
  room: ['room'],
};

// Where an entry came from, read across the whole course: the kid is told when
// something is new, how long they have had it, when it is back after a gap, and
// when it belongs to this room alone. A kit that grows should read as one.
function label(kits, index, section, call) {
  const has = (i) =>
    (PRESENCE[section] ?? [section]).some((list) =>
      (kits[i]?.kit[list] ?? []).some((entry) => entry.call === call),
    );
  const first = kits.findIndex((_, i) => has(i));
  const later = kits.some((_, i) => i > index && has(i));
  if (first === index) return later ? 'new here' : 'just this room';
  if (has(index - 1)) return `since lesson ${lessonNumber(kits[first].slug)}`;
  return `back from lesson ${lessonNumber(kits[first].slug)}`;
}

function table(head, what, entries) {
  const rows = entries.map(
    (e) => `| \`${e.call}\` | ${e.doc} | ${e.label ?? ''} |`,
  );
  return [
    `| ${head} | ${what} | Where from |`,
    '| --- | --- | --- |',
    ...rows,
  ].join('\n');
}

function kitMarkdown(kit) {
  const out = [
    '# Your kit',
    '',
    'Everything this lesson hands you, and what each one does. Nothing outside',
    'this page exists yet. Every file named below is in this project, and none',
    'of it is shut to you: open it and read it.',
    '',
  ];
  if (kit.moves.length > 0) {
    out.push('## Your moves', '');
    out.push('Ready-made, and yours to spend. They live in');
    out.push('`src/harness/moves.ts`, and you may read them.', '');
    out.push(table('Call', 'What it does', kit.moves), '');
  }
  if (kit.own.length > 0) {
    out.push('## Yours to write', '');
    out.push('Handed to you before, and this lesson you write them yourself.');
    out.push('They are in `src/exercise.ts`, under your own name.', '');
    out.push(table('Call', 'What it does', kit.own), '');
  }
  if (kit.robot.length > 0) {
    out.push('## The robot', '');
    out.push('The robot itself. One call, one thing done. It lives in');
    out.push('`src/harness/robot.ts`, under everything else you spend.', '');
    out.push(table('Call', 'What it does', kit.robot), '');
  }
  if (kit.room.length > 0) {
    out.push('## The room', '');
    out.push('Numbers the room hands your code. Read them; do not type in');
    out.push('numbers of your own, because the next room is a different size.');
    out.push('The rooms themselves are built in `src/harness/task.ts`.');
    out.push('');
    out.push(table('Value', 'What it is', kit.room), '');
  }
  return `${out.join('\n')}\n`;
}

// The block at the top of the file the kid types in: signatures, one line each,
// padded into a column. The full sentence lives in kit.md; this is the reminder,
// so a gloss is cut to whatever is left of the line.
const LINE = 79;

function gloss(text, room) {
  const sentence = firstSentence(text);
  if (sentence.length <= room) return sentence;
  const cut = sentence.slice(0, room - 3);
  return `${cut.slice(0, cut.lastIndexOf(' '))}...`;
}

function kitHeader(kit) {
  const entries = [...kit.moves, ...kit.robot, ...kit.room];
  if (entries.length === 0) return null;
  const width = Math.max(...entries.map((e) => e.call.length));
  const lines = [
    START,
    '// Everything you can call this lesson. The "Your kit" button in the',
    '// preview says more about each one.',
  ];
  for (const entry of entries) {
    const call = entry.call.padEnd(width);
    lines.push(`//   ${call}  ${gloss(entry.doc, LINE - width - 7)}`);
  }
  lines.push(END);
  return lines.join('\n');
}

// The header goes under the imports, above the lesson's own words. Once the
// markers are in a file, later runs replace what is between them.
function withHeader(source, header) {
  if (source.includes(START)) {
    const from = source.indexOf(START);
    const to = source.indexOf(END, from) + END.length + 1;
    return `${source.slice(0, from)}${header}\n${source.slice(to)}`;
  }
  const lines = source.split('\n');
  let at = 0;
  let inside = false;
  while (at < lines.length) {
    const line = lines[at] ?? '';
    if (!inside && !line.startsWith('import ')) break;
    inside = !line.trimEnd().endsWith(';');
    at += 1;
  }
  const head = lines.slice(0, at);
  const tail = lines.slice(at);
  while ((tail[0] ?? '').trim() === '') tail.shift();
  const block = head.length === 0 ? [header, ''] : [...head, '', header, ''];
  return [...block, ...tail].join('\n');
}

const stale = [];

function put(path, content) {
  if (read(path) === content) return;
  stale.push(path.replace(`${ROOT}/`, ''));
  if (!check) writeFileSync(path, content);
}

const slugs = readdirSync(LESSONS, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

// Every lesson is read before any is written: a kit says where each of its
// entries came from, and only the whole course knows that.
const kits = slugs.map((slug) => ({
  slug,
  kit: { ...readKit(join(LESSONS, slug)), own: [] },
}));

// A move the harness has taken back, which the exercise now exports, is the
// kid's own. It keeps the doc from the lesson that last handed it over.
function handedOver(index, call) {
  const before = kits.slice(0, index).reverse();
  const after = kits.slice(index + 1);
  for (const other of [...before, ...after]) {
    const match = other.kit.moves.find((e) => nameOf(e.call) === nameOf(call));
    if (match) return match;
  }
  return null;
}

// Two passes: every lesson's own moves are known before any label is read,
// because a label asks what the lessons on either side of this one hand over.
kits.forEach((entry, index) => {
  const exercise = read(join(LESSONS, entry.slug, 'src', 'exercise.ts'));
  const handed = new Set(entry.kit.moves.map((e) => nameOf(e.call)));
  for (const own of ownEntries(exercise)) {
    if (handed.has(nameOf(own.call))) continue;
    const source = handedOver(index, own.call);
    if (source) {
      entry.kit.own.push({
        ...own,
        doc: source.doc,
        label: 'you write it here',
      });
    }
  }
});

kits.forEach((entry, index) => {
  for (const section of ['moves', 'robot', 'room']) {
    for (const item of entry.kit[section]) {
      item.label = label(kits, index, section, item.call);
    }
  }
});

for (const { slug, kit } of kits) {
  const dir = join(LESSONS, slug);
  const total = kit.moves.length + kit.robot.length + kit.room.length;
  if (total === 0) continue;

  put(join(dir, 'kit.md'), kitMarkdown(kit));

  const header = kitHeader(kit);
  for (const base of [dir, join(SOLUTIONS, slug)]) {
    const exercise = join(base, 'src', 'exercise.ts');
    const source = read(exercise);
    if (source === null || header === null) continue;
    put(exercise, withHeader(source, header));
  }
}

if (stale.length === 0) {
  console.log(`build-kit: ${slugs.length} lessons, kit up to date`);
  process.exit(0);
}

console.log(`build-kit: ${check ? 'stale' : 'wrote'}\n  ${stale.join('\n  ')}`);
process.exit(check ? 1 : 0);
