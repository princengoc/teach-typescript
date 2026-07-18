import { expect, test } from 'vitest';
import { startX, startY } from './exercise';
import {
  builtInMoves,
  doorCell,
  makeStartWorld,
  targetWorld,
} from './harness/task';
import { paintedCells, run } from './harness/world';

test('the robot starts at the door: x is 2, y is 4', () => {
  const world = makeStartWorld(startX, startY);
  expect(world.robot.x).toBe(doorCell.x);
  expect(world.robot.y).toBe(doorCell.y);
});

test('from the door, the built-in moves paint the whole target', () => {
  const finished = run(makeStartWorld(startX, startY), builtInMoves);
  expect(finished.crashed).toBe(false);
  expect(paintedCells(finished)).toEqual(paintedCells(targetWorld));
});
