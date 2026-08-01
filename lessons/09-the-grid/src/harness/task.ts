import { runProgram } from './robot';
import type { Cell, Direction, Room, World } from './types';
import { makeWorld, paintedCells } from './world';

// One room a rung is graded in: a box `width` across and `height` down. The
// kid's code reads those two numbers and walks the box with a loop inside a
// loop, painting the squares the pattern wants.
export interface Variant {
  label: string;
  width: number;
  height: number;
  start: { x: number; y: number; facing: Direction };
  target: Cell[];
}

function key(cell: Cell): string {
  return `${cell.x},${cell.y}`;
}

// The room the kid's program is handed: just the two numbers, no grid.
export function toRoom(variant: Variant): Room {
  return { width: variant.width, height: variant.height };
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

function variant(
  width: number,
  height: number,
  wanted: (cell: Cell) => boolean,
): Variant {
  return {
    label: `${width} across, ${height} down`,
    width,
    height,
    start: { x: 0, y: 0, facing: 'east' },
    target: box(width, height).filter(wanted),
  };
}

// RUNG 1. Every square of the box.
export function fillVariant(width: number, height: number): Variant {
  return variant(width, height, () => true);
}

// RUNG 2. Every other square, counting across and down together.
export function checkerVariant(width: number, height: number): Variant {
  return variant(width, height, (cell) => (cell.x + cell.y) % 2 === 0);
}

// RUNG 3. Row 0 is the full width; every row below is one square shorter.
export function stairVariant(width: number, height: number): Variant {
  return variant(width, height, (cell) => cell.x < width - cell.y);
}

// Each rung is graded in two rooms of different sizes, so a box with its
// numbers typed in fills one and misses the other.
export const fillVariants: Variant[] = [fillVariant(4, 3), fillVariant(6, 5)];
export const checkerVariants: Variant[] = [
  checkerVariant(5, 4),
  checkerVariant(7, 3),
];
export const stairVariants: Variant[] = [
  stairVariant(5, 4),
  stairVariant(7, 5),
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

// One judge for one room, called by both the test and the preview. It hands the
// program the room's two numbers and grades the squares it paints.
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
      message: 'The robot walked off the box.',
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

// A rung is done only when the same loops paint the pattern in every room. A
// loop with a number nailed down passes one room and fails the rest.
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
