import { runProgram } from './robot';
import type { Cell, Direction, Room, World } from './types';
import { makeWorld, paintedCells } from './world';

export const ROWS = 3;

// One room the staircase is graded in. The room picks how long the first row
// is; each row below is one square longer, so the same code has to read the
// number rather than guess it.
export interface Variant {
  label: string;
  len: number;
  start: { x: number; y: number; facing: Direction };
  target: Cell[];
}

function key(cell: Cell): string {
  return `${cell.x},${cell.y}`;
}

// The room the kid's program is handed: one number, no grid.
export function toRoom(variant: Variant): Room {
  return { len: variant.len };
}

// Row 0 is `len` squares long, and every row below it is one longer.
export function staircaseCells(len: number): Cell[] {
  const cells: Cell[] = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < len + y; x += 1) {
      cells.push({ x, y });
    }
  }
  return cells;
}

// The room is exactly as wide as its longest row, so a row that overruns walks
// the robot into the wall and the verdict says so.
export function roomWidth(len: number): number {
  return len + ROWS - 1;
}

export function variant(len: number): Variant {
  return {
    label: `first row ${len}`,
    len,
    start: { x: 0, y: 0, facing: 'east' },
    target: staircaseCells(len),
  };
}

// Two rooms, so a staircase with its lengths typed in fits one and misses the
// other.
export const shortRoom = variant(2);
export const longRoom = variant(3);
export const rooms: Variant[] = [shortRoom, longRoom];

export function startWorld(variant: Variant): World {
  return makeWorld(roomWidth(variant.len), ROWS, { ...variant.start });
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
// program the room's number and grades the squares it paints.
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
      message:
        'The robot walked into the wall. A row was longer than the room.',
      tone: 'todo',
    };
  }
  if (got.length === 0) {
    return { solved: false, message: 'Nothing painted yet.', tone: 'todo' };
  }

  const right = got.filter((cell) => wanted.includes(cell));
  if (right.length === wanted.length && got.length === wanted.length) {
    return {
      solved: true,
      message: 'PASS. The staircase stands.',
      tone: 'done',
    };
  }
  return {
    solved: false,
    message: `Not the staircase yet: ${right.length} of ${wanted.length} squares are right. Keep going.`,
    tone: 'progress',
  };
}

// The lesson is only done when the same code builds the staircase in every
// room. Code that types the lengths in passes one room and fails the rest.
export function judgeAll(program: (room: Room) => void): Verdict {
  const failed = rooms
    .map((variant) => ({ variant, verdict: judge(variant, program) }))
    .find((entry) => !entry.verdict.solved);
  if (!failed) {
    return {
      solved: true,
      message: 'Well done! PASS. One move, and every room gets its staircase.',
      tone: 'done',
    };
  }
  return {
    ...failed.verdict,
    message: `${failed.variant.label}: ${failed.verdict.message}`,
  };
}
