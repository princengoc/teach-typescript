import { runProgram } from './robot';
import type { Cell, World } from './types';
import { makeWorld, paintedCells } from './world';

export const WIDTH = 7;
export const HEIGHT = 4;
export const SHELF_LENGTH = 3;

// The coin flip. The door is in the left wall or the right wall, and the
// robot always comes in the same way: facing south, standing on the door.
export const DOOR_ROW = 2;
export const FACING = 'south';
export const leftDoor: Cell = { x: 0, y: DOOR_ROW };
export const rightDoor: Cell = { x: WIDTH - 1, y: DOOR_ROW };
export const doors: Cell[] = [leftDoor, rightDoor];

export function doorName(door: Cell): string {
  return door.x === 0 ? 'door on the left' : 'door on the right';
}

// The shelf always runs away from the door, into the room.
function inward(door: Cell): number {
  return door.x === 0 ? 1 : -1;
}

export function shelfCells(door: Cell): Cell[] {
  const dx = inward(door);
  return Array.from({ length: SHELF_LENGTH }, (_, i) => ({
    x: door.x + i * dx,
    y: door.y,
  }));
}

export function startWorld(door: Cell): World {
  return makeWorld(WIDTH, HEIGHT, { x: door.x, y: door.y, facing: FACING });
}

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

// One judge for one room, called by both the test and the preview. The two
// crash messages are different on purpose: never turning and turning the
// wrong way look the same in the verdict line but need different fixes.
export function judge(door: Cell, program: () => void): Verdict {
  const { world } = runProgram(startWorld(door), program);
  const wanted = shelfCells(door).map((cell) => `${cell.x},${cell.y}`);
  const got = paintedCells(world);

  if (world.crashed && world.robot.facing === FACING) {
    return {
      solved: false,
      message:
        'The robot never turned. It walked straight down the room and hit the far wall.',
      tone: 'todo',
    };
  }
  if (world.crashed) {
    return {
      solved: false,
      message:
        'The robot turned the wrong way for this room and walked into the wall beside the door.',
      tone: 'todo',
    };
  }
  if (got.length === 0) {
    return {
      solved: false,
      message: 'Nothing painted yet.',
      tone: 'todo',
    };
  }

  const right = got.filter((cell) => wanted.includes(cell));
  if (right.length === wanted.length && got.length === wanted.length) {
    return {
      solved: true,
      message: `PASS. The shelf is painted from the ${doorName(door)}.`,
      tone: 'done',
    };
  }
  return {
    solved: false,
    message: `Good start: ${right.length} of ${wanted.length} squares painted. Keep going.`,
    tone: 'progress',
  };
}

// The lesson is only done when the same code survives both rooms. A verdict
// that named only the room the coin landed on would let half a solution pass.
export function judgeAll(program: () => void): Verdict {
  const verdicts = doors.map((door) => ({
    door,
    verdict: judge(door, program),
  }));
  const failed = verdicts.find((entry) => !entry.verdict.solved);
  if (!failed) {
    return {
      solved: true,
      message:
        'Well done! PASS. One move, and it works whichever wall the door is in.',
      tone: 'done',
    };
  }
  return {
    ...failed.verdict,
    message: `${doorName(failed.door)}: ${failed.verdict.message}`,
  };
}
