import type { Cell, Command, World } from './types';
import { makeWorld, paintedCells, run } from './world';

export const WIDTH = 8;
export const HEIGHT = 6;

// Three shelves, three squares each, two rows apart.
export const SHELVES = 3;
export const SHELF_LENGTH = 3;
export const SHELF_GAP = 2;

// The door the lesson ships with, then two more the same script must survive.
export const lessonDoor: Cell = { x: 1, y: 1 };
export const otherDoors: Cell[] = [
  { x: 3, y: 1 },
  { x: 5, y: 1 },
];

// The robot always comes through the door facing into the room.
export const FACING = 'south';

export function shelfRows(door: Cell): number[] {
  return Array.from({ length: SHELVES }, (_, i) => door.y + i * SHELF_GAP);
}

export function shelfCells(door: Cell): Cell[] {
  return shelfRows(door).flatMap((y) =>
    Array.from({ length: SHELF_LENGTH }, (_, i) => ({ x: door.x + i, y })),
  );
}

export function startWorld(door: Cell): World {
  return makeWorld(WIDTH, HEIGHT, { x: door.x, y: door.y, facing: FACING });
}

// The target is data, not a recording of the answer: paint the shelves in.
export function targetWorld(door: Cell): World {
  const world = startWorld(door);
  const wanted = new Set(shelfCells(door).map((cell) => `${cell.x},${cell.y}`));
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

function columnsOn(world: World, y: number): number[] {
  return paintedCells(world)
    .map((cell) => cell.split(','))
    .filter((parts) => Number(parts[1]) === y)
    .map((parts) => Number(parts[0]))
    .sort((a, b) => a - b);
}

// A shelf's shape, ignoring where it starts: the same shape at three
// different starts means the kid wrote one move and spent it three times.
function shape(columns: number[]): string {
  const first = columns[0] ?? 0;
  return columns.map((x) => x - first).join(',');
}

function allSame(values: string[]): boolean {
  return values.every((value) => value === values[0]);
}

// One judge, called by both the test and the preview, so they cannot
// disagree. When every shelf is wrong the same way, the message names the
// definition, because that is where the one fix goes.
export function judge(door: Cell, commands: Command[]): Verdict {
  const world = run(startWorld(door), commands);
  const wanted = shelfCells(door).map((cell) => `${cell.x},${cell.y}`);
  const got = paintedCells(world);

  if (world.crashed) {
    return {
      solved: false,
      message: 'The robot walked into a wall. paintShelf walks too far.',
      tone: 'todo',
    };
  }
  if (got.length === 0) {
    return {
      solved: false,
      message: 'Nothing painted yet. paintShelf needs a robot.paint() inside.',
      tone: 'todo',
    };
  }

  const rows = shelfRows(door);
  const shelves = rows.map((y) => columnsOn(world, y));
  const strays = got.length - shelves.flat().length;
  if (strays > 0) {
    return {
      solved: false,
      message:
        'A painted square is not on a shelf row. paintShelf has to end facing the way it started.',
      tone: 'todo',
    };
  }
  if (shelves.some((columns) => columns.length === 0)) {
    return {
      solved: false,
      message: `Only ${shelves.filter((columns) => columns.length > 0).length} of ${SHELVES} shelves have paint on them.`,
      tone: 'progress',
    };
  }

  const starts = shelves.map((columns) => String(columns[0]));
  if (!allSame(starts)) {
    return {
      solved: false,
      message:
        'Each shelf starts further along than the last. paintShelf has to leave the robot where it found it.',
      tone: 'progress',
    };
  }

  const right = got.filter((cell) => wanted.includes(cell));
  if (right.length === wanted.length && got.length === wanted.length) {
    return {
      solved: true,
      message: 'Well done! PASS. Three shelves, one move, written once.',
      tone: 'done',
    };
  }

  if (allSame(shelves.map(shape))) {
    return {
      solved: false,
      message:
        'You painted the same shelf three times, and it is wrong the same way three times. Fix paintShelf once and all three follow.',
      tone: 'progress',
    };
  }

  return {
    solved: false,
    message: `Good start: ${right.length} of ${wanted.length} squares painted. Keep going.`,
    tone: 'progress',
  };
}
