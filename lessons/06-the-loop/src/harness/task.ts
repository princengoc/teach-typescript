import { runProgram } from './robot';
import type { Cell, Dims, Direction, World } from './types';
import { makeWorld, paintedCells } from './world';

// One grid holds every rung. It is wide enough for a five-bar staircase (the
// trailing step lands on the last column) and tall enough for the tallest bar.
export const WIDTH = 6;
export const HEIGHT = 6;
export const BASE_ROW = HEIGHT - 1;

function zeroDims(): Dims {
  return { squareSide: 0, rectWidth: 0, rectHeight: 0, barCount: 0 };
}

function key(cell: Cell): string {
  return `${cell.x},${cell.y}`;
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

// The outline of a width-by-height block anchored at the top-left corner: every
// cell on an edge, none inside.
function borderCells(width: number, height: number): Cell[] {
  const cells: Cell[] = [];
  for (let x = 0; x < width; x += 1) {
    cells.push({ x, y: 0 });
    cells.push({ x, y: height - 1 });
  }
  for (let y = 0; y < height; y += 1) {
    cells.push({ x: 0, y });
    cells.push({ x: width - 1, y });
  }
  return dedupe(cells);
}

// A staircase of `barCount` bars: bar i stands in column i and is i + 1 tall,
// growing up from the base row.
export function staircaseCells(barCount: number): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < barCount; i += 1) {
    for (let k = 0; k <= i; k += 1) {
      cells.push({ x: i, y: BASE_ROW - k });
    }
  }
  return cells;
}

// One room a rung is graded in: where the robot starts, the numbers it can
// read, and the cells its figure should paint.
export interface Variant {
  label: string;
  start: { x: number; y: number; facing: Direction };
  dims: Dims;
  target: Cell[];
}

function squareVariant(side: number): Variant {
  return {
    label: `side ${side}`,
    start: { x: 0, y: 0, facing: 'east' },
    dims: { ...zeroDims(), squareSide: side },
    target: borderCells(side, side),
  };
}

function rectVariant(width: number, height: number): Variant {
  return {
    label: `${width} by ${height}`,
    start: { x: 0, y: 0, facing: 'east' },
    dims: { ...zeroDims(), rectWidth: width, rectHeight: height },
    target: borderCells(width, height),
  };
}

function stairVariant(barCount: number): Variant {
  return {
    label: `${barCount} bars`,
    start: { x: 0, y: BASE_ROW, facing: 'north' },
    dims: { ...zeroDims(), barCount },
    target: staircaseCells(barCount),
  };
}

// Each rung is graded in two rooms, so code that nails the numbers down passes
// one and misses the other.
export const squareVariants: Variant[] = [squareVariant(3), squareVariant(4)];
export const rectVariants: Variant[] = [rectVariant(4, 2), rectVariant(3, 4)];
export const stairVariants: Variant[] = [stairVariant(3), stairVariant(5)];

export function startWorld(variant: Variant): World {
  return makeWorld(WIDTH, HEIGHT, { ...variant.start }, variant.dims);
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
// that hardcodes the numbers passes one room and fails the rest.
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
