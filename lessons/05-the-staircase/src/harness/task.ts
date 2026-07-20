import { runProgram } from './robot';
import type { Cell, World } from './types';
import { makeWorld, paintedCells } from './world';

export const WIDTH = 5;
export const HEIGHT = 6;
export const BARS = 3;
export const BASE_ROW = HEIGHT - 1;
export const FACING = 'north';

// Each room decides how tall the first bar is. The staircase then climbs by
// one bar after that, so the same code has to read the number, not guess it.
export const rooms: number[] = [2, 3];

export function roomName(startHeight: number): string {
  return `first bar ${startHeight}`;
}

// The cells one bar covers: from the foot, straight up.
function barCells(column: number, height: number): Cell[] {
  return Array.from({ length: height }, (_, i) => ({
    x: column,
    y: BASE_ROW - i,
  }));
}

export function staircaseCells(startHeight: number): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < BARS; i += 1) {
    cells.push(...barCells(i, startHeight + i));
  }
  return cells;
}

export function startWorld(startHeight: number): World {
  return makeWorld(
    WIDTH,
    HEIGHT,
    { x: 0, y: BASE_ROW, facing: FACING },
    startHeight,
  );
}

export function targetWorld(startHeight: number): World {
  const world = startWorld(startHeight);
  const wanted = new Set(
    staircaseCells(startHeight).map((cell) => `${cell.x},${cell.y}`),
  );
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
export function judge(startHeight: number, program: () => void): Verdict {
  const { world } = runProgram(startWorld(startHeight), program);
  const wanted = staircaseCells(startHeight).map(
    (cell) => `${cell.x},${cell.y}`,
  );
  const got = paintedCells(world);

  if (world.crashed) {
    return {
      solved: false,
      message: 'The robot walked off the grid. A bar was taller than the room.',
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
// room. Code that hardcodes the heights passes one room and fails the rest.
export function judgeAll(program: () => void): Verdict {
  const verdicts = rooms.map((startHeight) => ({
    startHeight,
    verdict: judge(startHeight, program),
  }));
  const failed = verdicts.find((entry) => !entry.verdict.solved);
  if (!failed) {
    return {
      solved: true,
      message: 'Well done! PASS. One move, and every room gets its staircase.',
      tone: 'done',
    };
  }
  return {
    ...failed.verdict,
    message: `${roomName(failed.startHeight)}: ${failed.verdict.message}`,
  };
}
