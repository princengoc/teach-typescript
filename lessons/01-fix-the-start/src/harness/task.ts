import type { Command, World } from './types';
import { makeWorld, run } from './world';

export const WIDTH = 8;
export const HEIGHT = 6;

// Where the lesson wants the door: the dashed goal square in the preview.
export const goalDoor = { x: 2, y: 4 };

// A wrong start for the demo's failure run: paints the wrong cells, no crash.
export const failStart = { x: 4, y: 2 };

export interface Placement {
  grid: { width: number; height: number };
  door: { x: number; y: number };
  start: { x: number; y: number };
  goal: { x: number; y: number };
}

function within(
  grid: { width: number; height: number },
  cell: { x: number; y: number },
): boolean {
  return (
    cell.x >= 0 && cell.x < grid.width && cell.y >= 0 && cell.y < grid.height
  );
}

function sameCell(
  a: { x: number; y: number },
  b: { x: number; y: number },
): boolean {
  return a.x === b.x && a.y === b.y;
}

// PASS: the door sits on the goal, the robot sits on the door, and the grid is
// big enough to hold them. Pure -- the test and the preview both call this.
export function placementSolved(p: Placement): boolean {
  return (
    p.grid.width > 0 &&
    p.grid.height > 0 &&
    within(p.grid, p.door) &&
    sameCell(p.door, p.goal) &&
    sameCell(p.start, p.door)
  );
}

export const builtInMoves: Command[] = [
  { kind: 'paint' },
  { kind: 'step' },
  { kind: 'paint' },
  { kind: 'step' },
  { kind: 'paint' },
  { kind: 'turn', hand: 'left' },
  { kind: 'step' },
  { kind: 'paint' },
  { kind: 'step' },
  { kind: 'paint' },
];

export function makeStartWorld(x: number, y: number): World {
  return makeWorld(WIDTH, HEIGHT, { x, y, facing: 'east' });
}

export const targetWorld: World = run(
  makeStartWorld(goalDoor.x, goalDoor.y),
  builtInMoves,
);
