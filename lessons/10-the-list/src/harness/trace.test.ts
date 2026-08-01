import { expect, test } from 'vitest';
import { chartVariants, startWorld } from './task';
import { applyBeat, beats } from './trace';
import { paintedCells } from './world';

test('the intro trace draws exactly the charts rung 1 is graded in', () => {
  expect(chartVariants.length).toBe(2);
  for (const variant of chartVariants) {
    let world = startWorld(variant);
    for (const beat of beats(variant)) {
      world = applyBeat(world, beat);
    }
    expect(world.crashed).toBe(false);
    expect(paintedCells(world)).toEqual(
      variant.target.map((cell) => `${cell.x},${cell.y}`).sort(),
    );
  }
});

test('the two intro lists differ, so the same beats draw two charts', () => {
  const [first, second] = chartVariants;
  expect(first?.label).not.toBe(second?.label);
});
