import type { Command, World } from './types';
import { makeWorld, run } from './world';

export const WIDTH = 8;
export const HEIGHT = 6;

export const doorCell = { x: 2, y: 4 };

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
  makeStartWorld(doorCell.x, doorCell.y),
  builtInMoves,
);
