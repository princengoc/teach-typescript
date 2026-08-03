import { runProgram } from './robot';
import type { Cell, Direction, Room, World } from './types';
import { makeWorld, paintedCells } from './world';

// One grid holds every rung. It is wide enough for the longest staircase row
// and tall enough for the tallest outline.
export const WIDTH = 6;
export const HEIGHT = 6;

function emptyRoom(): Room {
  return { side: 0, width: 0, height: 0, len: 0 };
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

// A staircase of `rows` rows: row 0 is `len` squares long and every row below
// it is one longer, each starting at the left wall.
export function staircaseCells(len: number, rows: number): Cell[] {
  const cells: Cell[] = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < len + y; x += 1) {
      cells.push({ x, y });
    }
  }
  return cells;
}

// One room a rung is graded in: where the robot starts, the numbers it can
// read, and the cells its figure should paint.
export interface Variant {
  label: string;
  start: { x: number; y: number; facing: Direction };
  room: Room;
  target: Cell[];
  walls?: Cell[];
}

function squareVariant(side: number): Variant {
  return {
    label: `side ${side}`,
    start: { x: 0, y: 0, facing: 'east' },
    room: { ...emptyRoom(), side },
    target: borderCells(side, side),
  };
}

function rectVariant(width: number, height: number): Variant {
  return {
    label: `${width} by ${height}`,
    start: { x: 0, y: 0, facing: 'east' },
    room: { ...emptyRoom(), width, height },
    target: borderCells(width, height),
  };
}

function stairVariant(len: number, rows: number): Variant {
  return {
    label: `${rows} rows from ${len}`,
    start: { x: 0, y: 0, facing: 'east' },
    room: { ...emptyRoom(), len, height: rows },
    target: staircaseCells(len, rows),
  };
}

// The walls that box a side-by-side square anchored at the top-left corner:
// one column just past its right edge, one row just past its foot. The other
// two edges are the grid itself. So the robot, walking a side, meets a wall
// exactly at the corner, whatever the side. Nothing tells it the number.
function squareWalls(side: number): Cell[] {
  const cells: Cell[] = [];
  for (let y = 0; y < side; y += 1) cells.push({ x: side, y });
  for (let x = 0; x < side; x += 1) cells.push({ x, y: side });
  return cells.filter((cell) => cell.x < WIDTH && cell.y < HEIGHT);
}

// A square whose side the kid is never told: no number to read, walls at its
// edge. The label stays `?` so the number never shows on screen to be copied.
export function blindSquareVariant(side: number): Variant {
  return {
    label: 'side ?',
    start: { x: 0, y: 0, facing: 'east' },
    room: emptyRoom(),
    target: borderCells(side, side),
    walls: squareWalls(side),
  };
}

// Each rung is graded in two rooms, so code that nails the numbers down passes
// one and misses the other.
export const squareVariants: Variant[] = [squareVariant(3), squareVariant(4)];
export const rectVariants: Variant[] = [rectVariant(4, 2), rectVariant(3, 4)];
export const stairVariants: Variant[] = [
  stairVariant(2, 3),
  stairVariant(1, 5),
];
// One room with interior walls, one that fills the grid, so the base case must
// stop on a real wall and on the grid edge alike.
export const blindVariants: Variant[] = [
  blindSquareVariant(4),
  blindSquareVariant(6),
];

export function startWorld(variant: Variant): World {
  const world = makeWorld(WIDTH, HEIGHT, { ...variant.start });
  if (!variant.walls) return world;
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

// One judge for one room, called by both the test and the preview. It hands the
// program the room's numbers and grades the squares it paints.
export function judge(
  variant: Variant,
  program: (room: Room) => void,
): Verdict {
  const { world } = runProgram(startWorld(variant), () =>
    program(variant.room),
  );
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
// that hardcodes the numbers passes one room and fails the rest.
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
