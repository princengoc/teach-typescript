import { runProgram } from './robot';
import type { Cell, Direction, World } from './types';
import { makeWorld, paintedCells } from './world';

// One room a rung is graded in: the grid size, where the robot starts, the
// walls it can feel, and the cells its figure should paint. No numbers are
// handed over: the robot feels the walls and counts.
export interface Variant {
  label: string;
  // The number the room hides -- the gap or the bar height. The robot must
  // measure it; code that reads it here is a demo, not a solution.
  hidden: number;
  width: number;
  height: number;
  start: { x: number; y: number; facing: Direction };
  target: Cell[];
  walls: Cell[];
}

function key(cell: Cell): string {
  return `${cell.x},${cell.y}`;
}

// A row of `len` squares along row `y`, starting at column `x0`.
function rowCells(y: number, x0: number, len: number): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < len; i += 1) {
    cells.push({ x: x0 + i, y });
  }
  return cells;
}

// A bar of `height` squares in column `x`, growing up from the base row.
function colCells(x: number, baseRow: number, height: number): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < height; i += 1) {
    cells.push({ x, y: baseRow - i });
  }
  return cells;
}

function dedupe(cells: Cell[]): Cell[] {
  const seen = new Set<string>();
  const out: Cell[] = [];
  for (const cell of cells) {
    if (!seen.has(key(cell))) {
      seen.add(key(cell));
      out.push(cell);
    }
  }
  return out;
}

// RUNG 1. A measuring lane along the top with a wall `gap` squares in, and a
// clear build lane along the bottom that no wall stops. Measure the gap, then
// paint that many squares down below.
const ROW1_WIDTH = 7;
const ROW1_HEIGHT = 3;
export function floatingRowVariant(gap: number): Variant {
  return {
    label: `gap ${gap}`,
    hidden: gap,
    width: ROW1_WIDTH,
    height: ROW1_HEIGHT,
    start: { x: 0, y: 0, facing: 'east' },
    target: rowCells(ROW1_HEIGHT - 1, 0, gap),
    walls: [{ x: gap, y: 0 }],
  };
}

// RUNG 2. The first column is a bar with a ceiling to feel; the columns after
// it have none. Measure the first, build the rest to match.
const BARS_WIDTH = 3;
const BARS_HEIGHT = 6;
export function matchBarsVariant(height: number): Variant {
  const base = BARS_HEIGHT - 1;
  const target = dedupe([
    ...colCells(0, base, height),
    ...colCells(1, base, height),
    ...colCells(2, base, height),
  ]);
  return {
    label: `height ${height}`,
    hidden: height,
    width: BARS_WIDTH,
    height: BARS_HEIGHT,
    start: { x: 0, y: base, facing: 'north' },
    target,
    walls: [{ x: 0, y: base - height }],
  };
}

// RUNG 3. A bar with a ceiling in the first column, and an open floor. Climb
// and count the bar, then walk home and lay a floor of the same length.
const CLIMB_WIDTH = 7;
const CLIMB_HEIGHT = 6;
export function climbFloorVariant(height: number): Variant {
  const base = CLIMB_HEIGHT - 1;
  const target = dedupe([
    ...colCells(0, base, height),
    ...rowCells(base, 0, height),
  ]);
  return {
    label: `height ${height}`,
    hidden: height,
    width: CLIMB_WIDTH,
    height: CLIMB_HEIGHT,
    start: { x: 0, y: base, facing: 'north' },
    target,
    walls: [{ x: 0, y: base - height }],
  };
}

// Each rung is graded in two rooms, so code that nails a number down passes one
// and misses the other.
export const floatingRowVariants: Variant[] = [
  floatingRowVariant(3),
  floatingRowVariant(5),
];
export const matchBarsVariants: Variant[] = [
  matchBarsVariant(3),
  matchBarsVariant(4),
];
export const climbFloorVariants: Variant[] = [
  climbFloorVariant(3),
  climbFloorVariant(5),
];

export function startWorld(variant: Variant): World {
  const world = makeWorld(variant.width, variant.height, { ...variant.start });
  const blocked = world.blocked.map((row) => [...row]);
  for (const cell of variant.walls) {
    const line = blocked[cell.y];
    if (line) line[cell.x] = true;
  }
  return { ...world, blocked };
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

// One judge for one room, called by both the test and the preview.
export function judge(variant: Variant, program: () => void): Verdict {
  const { world } = runProgram(startWorld(variant), program);
  const wanted = variant.target.map(key);
  const got = paintedCells(world);

  if (world.crashed) {
    return {
      solved: false,
      message: 'The robot walked off the grid.',
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

// A rung is done only when the same code paints its figure in every room. Code
// that hardcodes the number passes one room and fails the rest.
export function judgeRung(variants: Variant[], program: () => void): Verdict {
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
