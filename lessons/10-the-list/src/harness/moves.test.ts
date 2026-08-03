import { expect, test } from 'vitest';
import { next, nextRow, paint } from './moves';
import { runProgram } from './robot';
import { makeWorld, paintedCells } from './world';

function box(): ReturnType<typeof makeWorld> {
  return makeWorld(5, 3, { x: 0, y: 0, facing: 'east' });
}

test('paint marks the square the robot stands on', () => {
  const { world } = runProgram(box(), () => {
    paint();
    next();
    paint();
  });
  expect(paintedCells(world)).toEqual(['0,0', '1,0']);
  expect(world.crashed).toBe(false);
});

test('nextRow lands on the first square of the row below, facing along it', () => {
  const { world } = runProgram(box(), () => {
    next();
    next();
    nextRow();
  });
  expect(world.robot).toEqual({ x: 0, y: 1, facing: 'east' });
  expect(world.crashed).toBe(false);
});

test('nextRow from the bottom row stays where it is', () => {
  const start = makeWorld(5, 3, { x: 2, y: 2, facing: 'east' });
  const { world } = runProgram(start, () => nextRow());
  expect(world.robot).toEqual({ x: 0, y: 2, facing: 'east' });
  expect(world.crashed).toBe(false);
});

test('next stops at the end of a row instead of walking off', () => {
  const { world } = runProgram(box(), () => {
    for (let i = 0; i < 10; i += 1) next();
  });
  expect(world.robot.x).toBe(4);
  expect(world.crashed).toBe(false);
});
