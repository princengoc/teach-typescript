import { runProgram } from './robot';
import type { Cell, Direction, Room, World } from './types';
import { makeWorld, paintedCells } from './world';

// One room a rung is graded in: a single lane `len` squares long, plus the two
// band ends `lo` and `hi`. The kid's code reads these numbers off the room and
// its rule decides, square by square, which to paint.
export interface Variant {
  label: string;
  len: number;
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
  return { len: variant.len, lo: variant.lo, hi: variant.hi };
}

// The squares of the one lane, along row 0.
function lane(len: number): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < len; i += 1) {
    cells.push({ x: i, y: 0 });
  }
  return cells;
}

// RUNG 1. Paint the back half: every square whose index is at least len / 2.
export function backHalfVariant(len: number): Variant {
  const target = lane(len).filter((cell) => cell.x >= len / 2);
  return {
    label: `lane ${len}`,
    len,
    lo: 0,
    hi: 0,
    start: { x: 0, y: 0, facing: 'east' },
    target,
  };
}

// RUNG 2. Paint every other square: the even indices.
export function stripeVariant(len: number): Variant {
  const target = lane(len).filter((cell) => cell.x % 2 === 0);
  return {
    label: `lane ${len}`,
    len,
    lo: 0,
    hi: 0,
    start: { x: 0, y: 0, facing: 'east' },
    target,
  };
}

// RUNG 3. Paint the band: every square from lo to hi, ends included.
export function bandVariant(len: number, lo: number, hi: number): Variant {
  const target = lane(len).filter((cell) => cell.x >= lo && cell.x <= hi);
  return {
    label: `lane ${len}, band ${lo}-${hi}`,
    len,
    lo,
    hi,
    start: { x: 0, y: 0, facing: 'east' },
    target,
  };
}

// Each rung is graded in two rooms, so a rule that nails one lane's numbers
// down passes one and misses the other.
export const backHalfVariants: Variant[] = [
  backHalfVariant(6),
  backHalfVariant(9),
];
export const stripeVariants: Variant[] = [stripeVariant(7), stripeVariant(10)];
export const bandVariants: Variant[] = [
  bandVariant(10, 3, 6),
  bandVariant(11, 4, 8),
];

export function startWorld(variant: Variant): World {
  return makeWorld(variant.len, 1, { ...variant.start });
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

  if (world.crashed) {
    return {
      solved: false,
      message: 'The robot walked off the lane.',
      tone: 'todo',
    };
  }
  if (got.length === 0) {
    return { solved: false, message: 'Nothing painted yet.', tone: 'todo' };
  }

  const right = got.filter((cell) => wanted.includes(cell));
  if (right.length === wanted.length && got.length === wanted.length) {
    return { solved: true, message: 'PASS.', tone: 'done' };
  }
  return {
    solved: false,
    message: `Not there yet: ${right.length} of ${wanted.length} squares are right.`,
    tone: 'progress',
  };
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
  if (!failed) {
    return { solved: true, message: 'PASS. Every room.', tone: 'done' };
  }
  return {
    ...failed.verdict,
    message: `${failed.variant.label}: ${failed.verdict.message}`,
  };
}
