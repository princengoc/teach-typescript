import { expect, test } from 'vitest';
import { pictureVariants, startWorld } from './task';
import { applyBeat, beats, moveNames, squaresAsked } from './trace';
import { paintedCells } from './world';

const INTRO = pictureVariants[0];

test('the intro trace draws exactly the picture rung 3 is graded in', () => {
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

test('the trace asks the rule about every square of the box', () => {
  if (!INTRO) return;
  const list = beats(INTRO);
  expect(squaresAsked(list)).toBe(INTRO.room.width * INTRO.room.height);
  expect(moveNames(list).filter((name) => name === 'nextRow()').length).toBe(
    INTRO.room.height,
  );
});

test('the trace says yes to the squares on the list and no to the rest', () => {
  if (!INTRO) return;
  const names = moveNames(beats(INTRO)).filter((name) =>
    name.startsWith('square '),
  );
  expect(names.filter((name) => name.endsWith('yes')).length).toBe(
    INTRO.target.length,
  );
});

test('the trace says so when a wall stops a step', () => {
  if (!INTRO) return;
  const stalled = beats(INTRO).filter((beat) => !beat.command);
  expect(stalled.length).toBeGreaterThan(0);
  for (const beat of stalled) {
    expect(beat.call).toBe('wall ahead, so no step');
  }
});
