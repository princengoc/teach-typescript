import { expect, test } from 'vitest';
import { paintBar, paintSide, stepToNextBar } from './moves';
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
import { paintedCells } from './world';

// The intended solutions, one per rung, reading the room's numbers.
function square(): void {
  const side = robot.squareSide();
  for (let i = 0; i < 4; i += 1) paintSide(side);
}

function rectangle(): void {
  const width = robot.rectWidth();
  const height = robot.rectHeight();
  for (let i = 0; i < 2; i += 1) {
    paintSide(width);
    paintSide(height);
  }
}

function staircaseLoop(): void {
  const barCount = robot.barCount();
  let height = 1;
  for (let i = 0; i < barCount; i += 1) {
    paintBar(height);
    stepToNextBar();
    height += 1;
  }
}

function climb(height: number, barsLeft: number): void {
  if (barsLeft === 0) return;
  paintBar(height);
  stepToNextBar();
  climb(height + 1, barsLeft - 1);
}

function staircaseRec(): void {
  climb(1, robot.barCount());
}

// A square with its side nailed to 3. It fits the side-3 room and no other.
function fixedSquare(): void {
  for (let i = 0; i < 4; i += 1) paintSide(3);
}

test('a staircase of n bars paints heights 1..n', () => {
  const cells = staircaseCells(3);
  expect(cells.length).toBe(1 + 2 + 3);
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

test('a side longer than the grid reads as walking off', () => {
  const variant = squareVariants[0];
  if (!variant) throw new Error('no variant');
  const verdict = judge(variant, () => paintSide(100));
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('off the grid');
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
      runProgram(startWorld(variant), staircaseLoop).world,
    );
    const rec = paintedCells(
      runProgram(startWorld(variant), staircaseRec).world,
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

test('the sensors are silent outside a run', () => {
  expect(robot.squareSide()).toBe(0);
  expect(robot.barCount()).toBe(0);
});
