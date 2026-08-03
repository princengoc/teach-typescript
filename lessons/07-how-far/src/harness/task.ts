import { runProgram } from './robot';
import type { Cell, Direction, World } from './types';
import { makeWorld, paintedCells } from './world';

// One room a rung is graded in: the grid size, where the robot starts, the
// walls it can feel, and the cells its figure should paint. No numbers are
// handed over: the robot feels the walls and counts.
export interface Variant {
  label: string;
  // The number the room hides. The robot must measure it; code that reads it
  // here is a demo, not a solution.
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

// A row of `len` squares along row `y`, starting at column 0.
function rowCells(y: number, len: number): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < len; i += 1) {
    cells.push({ x: i, y });
  }
  return cells;
}

// Every room is the same shape: a measuring row along the top with a wall `gap`
// squares in, and open rows below that no wall stops. The number lives in the
// top row and must be carried down.
const WIDTH = 7;

function room(
  gap: number,
  rows: number,
  target: Cell[],
  label: string,
): Variant {
  return {
    label,
    hidden: gap,
    width: WIDTH,
    height: rows,
    start: { x: 0, y: 0, facing: 'east' },
    target,
    walls: [{ x: gap, y: 0 }],
  };
}

// RUNG 1. Measure the gap along the top, then paint a row that long underneath,
// where nothing stops you at the right place.
export function floatingRowVariant(gap: number): Variant {
  return room(gap, 2, rowCells(1, gap), `gap ${gap}`);
}

// RUNG 2. The same gap, spent three times: three rows below, all matching, and
// only the top row has a wall to feel.
export function matchRowsVariant(gap: number): Variant {
  const target = [
    ...rowCells(1, gap),
    ...rowCells(2, gap),
    ...rowCells(3, gap),
  ];
  return room(gap, 4, target, `gap ${gap}`);
}

// RUNG 3. Paint the top row as you count it, then match it below. The count is
// produced in one pass and spent in another.
export function paintAndMatchVariant(gap: number): Variant {
  const target = [...rowCells(0, gap), ...rowCells(1, gap)];
  return room(gap, 2, target, `gap ${gap}`);
}

// Each rung is graded in two rooms, so code that nails a number down passes one
// and misses the other.
export const floatingRowVariants: Variant[] = [
  floatingRowVariant(3),
  floatingRowVariant(5),
];
export const matchRowsVariants: Variant[] = [
  matchRowsVariant(3),
  matchRowsVariant(4),
];
export const paintAndMatchVariants: Variant[] = [
  paintAndMatchVariant(3),
  paintAndMatchVariant(5),
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
      message: 'The robot walked into the wall.',
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
