import { expect, test } from 'vitest';
import { fillVariants, startWorld } from './task';
import { applyBeat, beats } from './trace';
import { paintedCells } from './world';

const INTRO = fillVariants[0];

test('the intro trace fills exactly the box the first rung is graded in', () => {
  if (!INTRO) throw new Error('no fill rooms defined');
  let world = startWorld(INTRO);
  for (const beat of beats(INTRO)) {
    world = applyBeat(world, beat);
  }
  expect(world.crashed).toBe(false);
  expect(paintedCells(world)).toEqual(
    INTRO.target.map((cell) => `${cell.x},${cell.y}`).sort(),
  );
});
