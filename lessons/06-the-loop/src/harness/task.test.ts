import { expect, test } from 'vitest';
import { nextRow, paintCells } from './moves';
import { robot, runProgram } from './robot';
import {
  judge,
  judgeRung,
  rectVariants,
  squareVariants,
  staircaseCells,
  stairVariants,
  startWorld,
  targetWorld,
} from './task';
import type { Room } from './types';
import { paintedCells } from './world';

// The intended solutions, one per rung, reading the room's numbers.
function square(room: Room): void {
  for (let i = 0; i < 4; i += 1) {
    paintCells(room.side);
    robot.turnRight();
  }
}

function rectangle(room: Room): void {
  for (let i = 0; i < 2; i += 1) {
    paintCells(room.width);
    robot.turnRight();
    paintCells(room.height);
    robot.turnRight();
  }
}

function staircaseLoop(room: Room): void {
  let len = room.len;
  for (let i = 0; i < room.height; i += 1) {
    paintCells(len);
    nextRow();
    len += 1;
  }
}

function stairsFrom(len: number, rowsLeft: number): void {
  if (rowsLeft === 0) return;
  paintCells(len);
  nextRow();
  stairsFrom(len + 1, rowsLeft - 1);
}

function staircaseRec(room: Room): void {
  stairsFrom(room.len, room.height);
}

// A square with its side nailed to 3. It fits the side-3 room and no other.
function fixedSquare(): void {
  for (let i = 0; i < 4; i += 1) {
    paintCells(3);
    robot.turnRight();
  }
}

test('a staircase of rows from len paints len, len+1, len+2', () => {
  expect(staircaseCells(2, 3).length).toBe(2 + 3 + 4);
});

test('the target world paints exactly the figure', () => {
  for (const variant of [
    ...squareVariants,
    ...rectVariants,
    ...stairVariants,
  ]) {
    const painted = paintedCells(targetWorld(variant));
    expect(painted.length).toBe(variant.target.length);
  }
});

test('an empty program is not solved', () => {
  const variant = squareVariants[0];
  if (!variant) throw new Error('no variant');
  const verdict = judge(variant, () => {});
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('Nothing painted');
});

test('a side longer than the grid reads as walking into the wall', () => {
  const variant = squareVariants[0];
  if (!variant) throw new Error('no variant');
  const verdict = judge(variant, () => paintCells(100));
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('into the wall');
});

test('each intended solution builds its figure in every room', () => {
  for (const variant of squareVariants) {
    expect(judge(variant, square).solved).toBe(true);
  }
  for (const variant of rectVariants) {
    expect(judge(variant, rectangle).solved).toBe(true);
  }
  for (const variant of stairVariants) {
    expect(judge(variant, staircaseLoop).solved).toBe(true);
    expect(judge(variant, staircaseRec).solved).toBe(true);
  }
});

test('the loop and the recursion paint the same staircase', () => {
  for (const variant of stairVariants) {
    const loop = paintedCells(
      runProgram(startWorld(variant), () => staircaseLoop(variant.room)).world,
    );
    const rec = paintedCells(
      runProgram(startWorld(variant), () => staircaseRec(variant.room)).world,
    );
    expect(rec).toEqual(loop);
  }
});

test('a nailed-down size survives exactly one of the rooms', () => {
  const small = squareVariants[0];
  const big = squareVariants[1];
  if (!small || !big) throw new Error('need two square rooms');
  expect(judge(small, fixedSquare).solved).toBe(true);
  expect(judge(big, fixedSquare).solved).toBe(false);
});

test('judgeRung refuses code that only fits one room, and names it', () => {
  const verdict = judgeRung(squareVariants, fixedSquare);
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('side 4');
});

test('judgeRung passes code that reads the room', () => {
  expect(judgeRung(squareVariants, square).solved).toBe(true);
  expect(judgeRung(rectVariants, rectangle).solved).toBe(true);
  expect(judgeRung(stairVariants, staircaseLoop).solved).toBe(true);
  expect(judgeRung(stairVariants, staircaseRec).solved).toBe(true);
});

test('the sensor is silent outside a run', () => {
  expect(robot.wallAhead()).toBe(true);
});
