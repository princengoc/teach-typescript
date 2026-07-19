import type { Command, World } from './types';
import { makeWorld, run } from './world';

export const WIDTH = 8;
export const HEIGHT = 6;

// Where the lesson wants the door: the dashed goal square in the preview.
export const goalDoor = { x: 2, y: 4 };

// A wrong start for the demo's failure run: paints the wrong cells, no crash.
export const failStart = { x: 4, y: 2 };

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
