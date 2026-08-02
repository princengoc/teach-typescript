import { expect, test } from 'vitest';
import { next, nextRow, paint, robot } from './moves';
import { runProgram } from './robot';
import { makeWorld, paintedCells } from './world';

function box(): ReturnType<typeof makeWorld> {
  return makeWorld(4, 3, { x: 0, y: 0, facing: 'east' });
}

test('next stops at the end of a row instead of walking off', () => {
  const { world } = runProgram(box(), () => {
    for (let i = 0; i < 10; i += 1) next();
  });
  expect(world.robot.x).toBe(3);
  expect(world.crashed).toBe(false);
});

test('paint colours the square the robot stands on', () => {
  const { world } = runProgram(box(), () => {
    next();
    paint();
  });
  expect(paintedCells(world)).toEqual(['1,0']);
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

test('nextRow on the bottom row stays on it, at the start', () => {
  const { world } = runProgram(
    makeWorld(4, 3, { x: 2, y: 2, facing: 'east' }),
    nextRow,
  );
  expect(world.robot).toEqual({ x: 0, y: 2, facing: 'east' });
  expect(world.crashed).toBe(false);
});

test('a program that never stops is cut off, not left to hang', () => {
  const { stopped } = runProgram(box(), function forever(): void {
    robot.turnLeft();
    forever();
  });
  expect(stopped).toBe(true);
});
