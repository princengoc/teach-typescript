// Pure checks for the lesson's four parts. The preview calls them to draw a
// verdict; the tests call the same functions.
import { attic, cellar, kitchen, room } from '../rooms';

// A verdict speaks as an instruction, not a grade: it names the next thing to
// do. 'progress' is for a half-done part that is on its way.
export type Tone = 'todo' | 'progress' | 'done';

export interface Check {
  pass: boolean;
  message: string;
  tone: Tone;
}

const PASS = (message: string): Check => ({
  pass: true,
  message,
  tone: 'done',
});
const FAIL = (message: string): Check => ({
  pass: false,
  message,
  tone: 'todo',
});
const STEP = (message: string): Check => ({
  pass: false,
  message,
  tone: 'progress',
});

export interface Predictions {
  width: number;
  doorX: number;
  doorY: number;
}

// Part 1. The verdict names the wrong prediction but never the right value:
// the point is to read rooms.ts again.
export function checkPredictions(p: Predictions): Check {
  if (p.width !== room.width) {
    return FAIL(`Not the width. You said ${p.width}. Read rooms.ts again.`);
  }
  if (p.doorX !== room.door.x) {
    return FAIL(`Not the door x. You said ${p.doorX}. Read the door line.`);
  }
  if (p.doorY !== room.door.y) {
    return FAIL(`Not the door y. You said ${p.doorY}. Read the door line.`);
  }
  return PASS('PASS: you read all three right.');
}

export interface Dots {
  kitchenDoorX: number;
  atticDoorY: number;
  cellarDoorX: number;
}

// Part 2. The source check keeps the kid reading with dots instead of copying
// the number the verdict would otherwise hand them.
export function checkDots(d: Dots, source: string): Check {
  if (d.kitchenDoorX !== kitchen.door.x) {
    return FAIL('kitchenDoorX is not the kitchen door x. Fix the last dot.');
  }
  if (d.atticDoorY !== attic.door.y) {
    return FAIL('atticDoorY is not the attic door y. Fix the last dot.');
  }
  if (d.cellarDoorX !== cellar.door.x) {
    return FAIL('cellarDoorX is not the cellar door x. Fix the last dot.');
  }
  if (!usesDots(source)) {
    return FAIL('Right numbers, wrong way. Read them with dots, not by hand.');
  }
  return PASS('PASS: three names, read out of three rooms.');
}

const DOT_LINE =
  /export const (kitchenDoorX|atticDoorY|cellarDoorX)\s*=([^;]*);/g;

// A part 2 line passes only if its value comes from a dot, not a typed number.
export function usesDots(source: string): boolean {
  const lines = [...source.matchAll(DOT_LINE)];
  if (lines.length !== 3) return false;
  return lines.every((line) => /\w+\.\w+\.\w+/.test(line[2] ?? ''));
}

export const charger = { x: 7, y: 5 };
export const parkRoom = { width: 8, height: 6 };

// Part 3.
export function checkPark(x: number, y: number): Check {
  if (x !== charger.x) return FAIL(`parkX should be ${charger.x}, not ${x}.`);
  if (y !== charger.y) return FAIL(`parkY should be ${charger.y}, not ${y}.`);
  return PASS('PASS: the robot is on the charger.');
}

export interface Placement {
  grid: { width: number; height: number };
  door: { x: number; y: number };
  start: { x: number; y: number };
  goal: { x: number; y: number };
}

// Part 4. One value at a time: size the room, place the door, start the robot.
export function checkPlacement(p: Placement): Check {
  const { grid, door, start, goal } = p;
  if (grid.width < 1 || grid.height < 1) {
    return FAIL('Give the room a width and a height of at least 1.');
  }
  if (
    door.x < 0 ||
    door.x >= grid.width ||
    door.y < 0 ||
    door.y >= grid.height
  ) {
    return FAIL('Make the room big enough to hold the door.');
  }
  if (door.x !== goal.x || door.y !== goal.y) {
    return FAIL('Put the door on the dashed goal square.');
  }
  if (start.x !== door.x || start.y !== door.y) {
    return STEP('Nice, the door is on the goal. Now put the robot on it.');
  }
  return PASS('PASS: the room is built and the robot is on the door.');
}
