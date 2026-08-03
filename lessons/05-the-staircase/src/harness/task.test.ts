import { expect, test } from 'vitest';
import { nextRow, paintCells } from './moves';
import { robot, runProgram } from './robot';
import {
  judge,
  judgeAll,
  longRoom,
  ROWS,
  rooms,
  shortRoom,
  staircaseCells,
  startWorld,
  targetWorld,
} from './task';
import type { Room } from './types';
import { paintedCells } from './world';

// The intended solution: read the first row's length, then grow it by one.
function staircase(room: Room): void {
  let len = room.len;
  paintCells(len);
  nextRow();
  len += 1;
  paintCells(len);
  nextRow();
  len += 1;
  paintCells(len);
}

// Lengths nailed to the first room. It builds one room's staircase and no
// other's.
function fixedLengths(): void {
  paintCells(2);
  nextRow();
  paintCells(3);
  nextRow();
  paintCells(4);
}

test('a room of first-row n wants rows n, n+1, n+2', () => {
  for (const variant of rooms) {
    const painted = paintedCells(targetWorld(variant));
    let expected = 0;
    for (let y = 0; y < ROWS; y += 1) expected += variant.len + y;
    expect(painted.length).toBe(expected);
    for (const cell of staircaseCells(variant.len)) {
      expect(painted).toContain(`${cell.x},${cell.y}`);
    }
  }
});

test('an empty program is not solved', () => {
  const verdict = judge(shortRoom, () => {});
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('Nothing painted');
});

test('a row longer than the room reads as walking into the wall', () => {
  const verdict = judge(shortRoom, () => paintCells(100));
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('into the wall');
});

test('the intended solution builds the staircase in every room', () => {
  for (const variant of rooms) {
    expect(judge(variant, staircase).solved).toBe(true);
  }
});

test('nailed-down lengths survive exactly one of the rooms', () => {
  expect(judge(shortRoom, fixedLengths).solved).toBe(true);
  expect(judge(longRoom, fixedLengths).solved).toBe(false);
});

test('judgeAll refuses code that only fits one room, and names the room', () => {
  const verdict = judgeAll(fixedLengths);
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('first row 3');
});

test('judgeAll passes code that reads the length and grows it', () => {
  expect(judgeAll(staircase).solved).toBe(true);
});

test('nextRow lands on the first square of the row below, facing along it', () => {
  const { world } = runProgram(startWorld(longRoom), () => {
    paintCells(3);
    nextRow();
  });
  expect(world.robot).toEqual({ x: 0, y: 1, facing: 'east' });
  expect(world.crashed).toBe(false);
});

test('nextRow from the bottom row stays on the row it is on', () => {
  const { world } = runProgram(startWorld(longRoom), () => {
    nextRow();
    nextRow();
    nextRow();
  });
  expect(world.robot).toEqual({ x: 0, y: ROWS - 1, facing: 'east' });
  expect(world.crashed).toBe(false);
});

test('runProgram hands back the commands it ran, in order', () => {
  const { commands } = runProgram(startWorld(shortRoom), () => {
    robot.walk(2);
    robot.paint();
  });
  expect(commands).toEqual([
    { kind: 'step' },
    { kind: 'step' },
    { kind: 'paint' },
  ]);
});
