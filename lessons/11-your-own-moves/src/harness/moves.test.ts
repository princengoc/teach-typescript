import { expect, test } from 'vitest';
import { next, paint, robot } from './moves';
import { runProgram } from './robot';
import { makeWorld, paintedCells } from './world';

function lane(): ReturnType<typeof makeWorld> {
  return makeWorld(4, 1, { x: 0, y: 0, facing: 'east' });
}

test('next stops at the end of a row instead of walking off', () => {
  const { world } = runProgram(lane(), () => {
    for (let i = 0; i < 10; i += 1) next();
  });
  expect(world.robot.x).toBe(3);
  expect(world.crashed).toBe(false);
});

test('paint colours the square the robot stands on', () => {
  const { world } = runProgram(lane(), () => {
    next();
    paint();
  });
  expect(paintedCells(world)).toEqual(['1,0']);
});

test('turnLeft is a quarter turn, and wallAhead feels the wall', () => {
  const { world } = runProgram(lane(), () => {
    expect(robot.wallAhead()).toBe(false);
    robot.turnLeft();
  });
  expect(world.robot.facing).toBe('north');
});

test('a program that never stops is cut off, not left to hang', () => {
  const { stopped } = runProgram(lane(), function forever(): void {
    robot.turnLeft();
    forever();
  });
  expect(stopped).toBe(true);
});
