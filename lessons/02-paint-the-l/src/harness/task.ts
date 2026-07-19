import type { Cell, Command, World } from './types';
import { makeWorld, paintedCells, run } from './world';

export const WIDTH = 8;
export const HEIGHT = 6;

// The door the lesson ships with, then two more the same script must survive.
export const lessonDoor: Cell = { x: 1, y: 1 };
export const otherDoors: Cell[] = [
  { x: 3, y: 0 },
  { x: 5, y: 2 },
];

// The robot always comes through the door facing into the room.
export const FACING = 'south';

// The L: three squares down from the door, then two to the left hand's side.
export function lCells(door: Cell): Cell[] {
  return [
    { x: door.x, y: door.y },
    { x: door.x, y: door.y + 1 },
    { x: door.x, y: door.y + 2 },
    { x: door.x + 1, y: door.y + 2 },
    { x: door.x + 2, y: door.y + 2 },
  ];
}

export function startWorld(door: Cell): World {
  return makeWorld(WIDTH, HEIGHT, { x: door.x, y: door.y, facing: FACING });
}

// The target is data, not a recording of the answer: paint the L cells in.
export function targetWorld(door: Cell): World {
  const world = startWorld(door);
  const wanted = new Set(lCells(door).map((cell) => `${cell.x},${cell.y}`));
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

// One judge, called by both the test and the preview, so they cannot disagree.
// The message names the next thing to do, the way lesson 01's did.
export function judge(door: Cell, commands: Command[]): Verdict {
  const world = run(startWorld(door), commands);
  const wanted = lCells(door).map((cell) => `${cell.x},${cell.y}`);
  const got = paintedCells(world);
  const right = got.filter((cell) => wanted.includes(cell));
  const wrong = got.filter((cell) => !wanted.includes(cell));

  if (world.crashed) {
    return {
      solved: false,
      message: 'The robot walked into a wall. Take out one step.',
      tone: 'todo',
    };
  }
  if (got.length === 0) {
    return {
      solved: false,
      message: 'Nothing painted yet. Start with robot.paint().',
      tone: 'todo',
    };
  }
  if (wrong.length > 0) {
    return {
      solved: false,
      message:
        'One painted square is not part of the L. Check the order of your calls.',
      tone: 'todo',
    };
  }
  if (right.length < wanted.length) {
    return {
      solved: false,
      message: `Good start: ${right.length} of ${wanted.length} squares painted. Keep going.`,
      tone: 'progress',
    };
  }
  return {
    solved: true,
    message: 'Well done! PASS. The L is painted.',
    tone: 'done',
  };
}
