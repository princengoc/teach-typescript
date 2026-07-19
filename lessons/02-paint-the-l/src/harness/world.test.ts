import { expect, test } from 'vitest';
import { makeWorld, paintedCells, run, step } from './world';

test('step moves the robot one cell in its facing direction', () => {
  const world = makeWorld(4, 4, { x: 1, y: 1, facing: 'east' });
  const after = step(world, { kind: 'step' });
  expect(after.robot.x).toBe(2);
  expect(after.robot.y).toBe(1);
  expect(after.crashed).toBe(false);
});

test('stepping off the grid crashes and the robot stays put', () => {
  const world = makeWorld(4, 4, { x: 3, y: 1, facing: 'east' });
  const after = step(world, { kind: 'step' });
  expect(after.crashed).toBe(true);
  expect(after.robot.x).toBe(3);
});

test('a crashed world ignores further commands', () => {
  const world = makeWorld(4, 4, { x: 3, y: 1, facing: 'east' });
  const crashed = step(world, { kind: 'step' });
  const after = run(crashed, [
    { kind: 'turn', hand: 'left' },
    { kind: 'paint' },
  ]);
  expect(after.robot.facing).toBe('east');
  expect(paintedCells(after)).toEqual([]);
});

test('turning left from east faces north', () => {
  const world = makeWorld(4, 4, { x: 1, y: 1, facing: 'east' });
  const after = step(world, { kind: 'turn', hand: 'left' });
  expect(after.robot.facing).toBe('north');
});

test('paint marks the cell under the robot', () => {
  const world = makeWorld(4, 4, { x: 2, y: 3, facing: 'north' });
  const after = step(world, { kind: 'paint' });
  expect(paintedCells(after)).toEqual(['2,3']);
});

test('turning left from south faces east', () => {
  const world = makeWorld(4, 4, { x: 1, y: 1, facing: 'south' });
  const after = step(world, { kind: 'turn', hand: 'left' });
  expect(after.robot.facing).toBe('east');
});
