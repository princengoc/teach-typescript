import { expect, test } from 'vitest';
import { chartVariants, startWorld } from './task';
import { applyBeat, beats, moveNames } from './trace';
import { paintedCells } from './world';

const INTRO = chartVariants[0];

test('the intro trace draws exactly the chart rung 2 is graded in', () => {
  expect(INTRO).toBeDefined();
  if (!INTRO) return;
  let world = startWorld(INTRO);
  for (const beat of beats(INTRO)) {
    world = applyBeat(world, beat);
  }
  expect(world.crashed).toBe(false);
  expect(paintedCells(world)).toEqual(
    INTRO.target.map((cell) => `${cell.x},${cell.y}`).sort(),
  );
});

test('the trace unfolds a handful of names into a pile of robot calls', () => {
  if (!INTRO) return;
  const list = beats(INTRO);
  const names = moveNames(list);
  expect(names.length).toBe(INTRO.room.bars.length * 2);
  expect(list.length).toBeGreaterThan(names.length * 4);
});

test('the trace says so when a wall stops a step', () => {
  if (!INTRO) return;
  const stalled = beats(INTRO).filter((beat) => !beat.command);
  expect(stalled.length).toBe(1);
  expect(stalled[0]?.move).toBe('nextRow()');
});
