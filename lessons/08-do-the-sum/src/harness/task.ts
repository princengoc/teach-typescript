import { runProgram } from './robot';
import type { Cell, Direction, Room, World } from './types';
import { makeWorld, paintedCells } from './world';

// One room a rung is graded in: a box `width` across and `height` down, plus
// the band's two ends. Rungs 1 and 2 use a single row; rung 3 uses the box. The
// kid's code reads these numbers and its rule decides what to paint.
export interface Variant {
  label: string;
  width: number;
  height: number;
  lo: number;
  hi: number;
  start: { x: number; y: number; facing: Direction };
  target: Cell[];
}

function key(cell: Cell): string {
  return `${cell.x},${cell.y}`;
}

// The room the kid's program is handed: just the numbers, no grid.
export function toRoom(variant: Variant): Room {
  return {
    width: variant.width,
    height: variant.height,
    lo: variant.lo,
    hi: variant.hi,
  };
}

// Every square of the box, row by row.
function box(width: number, height: number): Cell[] {
  const cells: Cell[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      cells.push({ x, y });
    }
  }
  return cells;
}

// The rules the kid writes, written once here so the picture and the rule check
// ask the same question of the same room.
export function backHalfOf(i: number, width: number): boolean {
  return i >= width / 2;
}

export function stripeOf(i: number): boolean {
  return i % 2 === 0;
}

export function bandRowOf(y: number, room: Room): boolean {
  return y >= room.lo && y <= room.hi;
}

// RUNG 1. Paint the back half of one row: every square at least halfway along.
export function backHalfVariant(width: number): Variant {
  return {
    label: `lane ${width}`,
    width,
    height: 1,
    lo: 0,
    hi: 0,
    start: { x: 0, y: 0, facing: 'east' },
    target: box(width, 1).filter((cell) => backHalfOf(cell.x, width)),
  };
}

// RUNG 2. Paint every other square of one row: the even ones.
export function stripeVariant(width: number): Variant {
  return {
    label: `lane ${width}`,
    width,
    height: 1,
    lo: 0,
    hi: 0,
    start: { x: 0, y: 0, facing: 'east' },
    target: box(width, 1).filter((cell) => stripeOf(cell.x)),
  };
}

// RUNG 3. The crossing: the same kind of rule, asked about a row instead of a
// square. Every row from lo to hi, ends included, is painted right across.
export function bandRowsVariant(
  width: number,
  height: number,
  lo: number,
  hi: number,
): Variant {
  const room: Room = { width, height, lo, hi };
  return {
    label: `${width} by ${height}, rows ${lo}-${hi}`,
    width,
    height,
    lo,
    hi,
    start: { x: 0, y: 0, facing: 'east' },
    target: box(width, height).filter((cell) => bandRowOf(cell.y, room)),
  };
}

// Each rung is graded in two rooms, so a rule that nails one room's numbers
// down passes one and misses the other.
export const backHalfVariants: Variant[] = [
  backHalfVariant(6),
  backHalfVariant(9),
];
export const stripeVariants: Variant[] = [stripeVariant(7), stripeVariant(10)];
export const bandRowsVariants: Variant[] = [
  bandRowsVariant(6, 5, 1, 3),
  bandRowsVariant(7, 6, 2, 4),
];

export function startWorld(variant: Variant): World {
  return makeWorld(variant.width, variant.height, { ...variant.start });
}

// A world with the target already painted, for the ghost outline in the preview.
export function targetWorld(variant: Variant): World {
  const world = startWorld(variant);
  const wanted = new Set(variant.target.map(key));
  const painted = world.painted.map((row, y) =>
    row.map((_, x) => wanted.has(`${x},${y}`)),
  );
  return { ...world, painted };
}

export type Tone = 'todo' | 'progress' | 'done';

export interface Verdict {
  solved: boolean;
  message: string;
  tone: Tone;
}

const PASS: Verdict = { solved: true, message: 'PASS.', tone: 'done' };

function fail(message: string, tone: Tone = 'todo'): Verdict {
  return { solved: false, message, tone };
}

// One judge for one room, called by both the test and the preview. It hands the
// program the room's numbers and grades the squares it paints.
export function judge(
  variant: Variant,
  program: (room: Room) => void,
): Verdict {
  const room = toRoom(variant);
  const { world } = runProgram(startWorld(variant), () => program(room));
  const wanted = variant.target.map(key);
  const got = paintedCells(world);

  if (world.crashed) return fail('The robot walked into the wall.');
  if (got.length === 0) return fail('Nothing painted yet.');

  const right = got.filter((cell) => wanted.includes(cell));
  if (right.length === wanted.length && got.length === wanted.length) {
    return PASS;
  }
  return fail(
    `Not there yet: ${right.length} of ${wanted.length} squares are right.`,
    'progress',
  );
}

// A rung is done only when the same rule paints its pattern in every room. A
// rule with a number nailed down passes one room and fails the rest.
export function judgeRung(
  variants: Variant[],
  program: (room: Room) => void,
): Verdict {
  const failed = variants
    .map((variant) => ({ variant, verdict: judge(variant, program) }))
    .find((entry) => !entry.verdict.solved);
  if (!failed) return { ...PASS, message: 'PASS. Every room.' };
  return {
    ...failed.verdict,
    message: `${failed.variant.label}: ${failed.verdict.message}`,
  };
}

// The rules are graded on their own as well as in the picture. A rule is an
// answer about one square, and it has to be right about every square: painting
// the right pattern some other way is not writing the rule.
function firstWrong(
  count: number,
  ask: (n: number) => boolean,
  want: (n: number) => boolean,
): number | null {
  for (let n = 0; n < count; n += 1) {
    if (ask(n) !== want(n)) return n;
  }
  return null;
}

function ruleFail(
  label: string,
  thing: string,
  n: number,
  wanted: boolean,
): Verdict {
  return fail(
    `${label}: ${thing} ${n} should be ${wanted ? 'yes' : 'no'}, and your rule says ${
      wanted ? 'no' : 'yes'
    }.`,
    'progress',
  );
}

export function checkBackHalf(
  rule: (i: number, width: number) => boolean,
): Verdict {
  for (const variant of backHalfVariants) {
    const wrong = firstWrong(
      variant.width,
      (i) => rule(i, variant.width),
      (i) => backHalfOf(i, variant.width),
    );
    if (wrong !== null) {
      return ruleFail(
        variant.label,
        'square',
        wrong,
        backHalfOf(wrong, variant.width),
      );
    }
  }
  return PASS;
}

export function checkStripe(rule: (i: number) => boolean): Verdict {
  for (const variant of stripeVariants) {
    const wrong = firstWrong(variant.width, rule, stripeOf);
    if (wrong !== null) {
      return ruleFail(variant.label, 'square', wrong, stripeOf(wrong));
    }
  }
  return PASS;
}

export function checkBandRow(
  rule: (y: number, room: Room) => boolean,
): Verdict {
  for (const variant of bandRowsVariants) {
    const room = toRoom(variant);
    const wrong = firstWrong(
      variant.height,
      (y) => rule(y, room),
      (y) => bandRowOf(y, room),
    );
    if (wrong !== null) {
      return ruleFail(variant.label, 'row', wrong, bandRowOf(wrong, room));
    }
  }
  return PASS;
}
