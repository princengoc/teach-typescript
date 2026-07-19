import { expect, test } from 'vitest';
import { robot, runProgram } from './robot';
import {
  doors,
  judge,
  judgeAll,
  leftDoor,
  rightDoor,
  shelfCells,
  startWorld,
  targetWorld,
} from './task';
import { paintedCells } from './world';

function paintShelf(): void {
  robot.paint();
  robot.walk(1);
  robot.paint();
  robot.walk(1);
  robot.paint();
}

function alwaysTurnRight(): void {
  robot.turnRight();
  paintShelf();
}

function askFirst(): void {
  if (robot.wallOnLeft()) {
    robot.turnRight();
  } else {
    robot.turnLeft();
  }
  paintShelf();
}

test('every door leaves room for the whole shelf', () => {
  for (const door of doors) {
    const painted = paintedCells(targetWorld(door));
    expect(painted.length).toBe(3);
    for (const cell of shelfCells(door)) {
      expect(painted).toContain(`${cell.x},${cell.y}`);
    }
  }
});

test('an empty program is not solved', () => {
  const verdict = judge(leftDoor, () => {});
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('Nothing painted');
});

test('never turning reads as walking down the room', () => {
  const verdict = judge(leftDoor, paintShelf);
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('never turned');
});

test('turning the wrong way reads as the wall beside the door', () => {
  const verdict = judge(leftDoor, alwaysTurnRight);
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('wrong way');
});

test('a move that asks nothing survives exactly one of the two rooms', () => {
  expect(judge(rightDoor, alwaysTurnRight).solved).toBe(true);
  expect(judge(leftDoor, alwaysTurnRight).solved).toBe(false);
});

test('judgeAll refuses a program that only half works, and names the room', () => {
  const verdict = judgeAll(alwaysTurnRight);
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('door on the left');
});

test('judgeAll passes a program that asks before it turns', () => {
  expect(judgeAll(askFirst).solved).toBe(true);
});

test('runProgram hands back the commands it ran, in order', () => {
  const { commands } = runProgram(startWorld(leftDoor), () => {
    robot.walk(2);
    robot.paint();
  });
  expect(commands).toEqual([
    { kind: 'step' },
    { kind: 'step' },
    { kind: 'paint' },
  ]);
});

test('the sensor is silent outside a run', () => {
  expect(robot.wallOnLeft()).toBe(false);
});
