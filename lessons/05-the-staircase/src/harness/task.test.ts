import { expect, test } from 'vitest';
import { goToNextBar, paintBar } from './moves';
import { robot, runProgram } from './robot';
import {
  BARS,
  judge,
  judgeAll,
  rooms,
  staircaseCells,
  startWorld,
  targetWorld,
} from './task';
import { paintedCells } from './world';

// The intended solution: read the first height, then grow it by one per bar.
function staircase(): void {
  let height = robot.startHeight();
  paintBar(height);
  goToNextBar();
  height += 1;
  paintBar(height);
  goToNextBar();
  height += 1;
  paintBar(height);
}

// Heights nailed to the first room. It builds one room's staircase and no
// other's.
function fixedHeights(): void {
  paintBar(2);
  goToNextBar();
  paintBar(3);
  goToNextBar();
  paintBar(4);
}

test('a room of first-bar s wants bars s, s+1, s+2', () => {
  for (const startHeight of rooms) {
    const painted = paintedCells(targetWorld(startHeight));
    let expected = 0;
    for (let i = 0; i < BARS; i += 1) expected += startHeight + i;
    expect(painted.length).toBe(expected);
    for (const cell of staircaseCells(startHeight)) {
      expect(painted).toContain(`${cell.x},${cell.y}`);
    }
  }
});

test('an empty program is not solved', () => {
  const verdict = judge(2, () => {});
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('Nothing painted');
});

test('a bar taller than the room reads as walking off the grid', () => {
  const verdict = judge(2, () => paintBar(100));
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('off the grid');
});

test('the intended solution builds the staircase in every room', () => {
  for (const startHeight of rooms) {
    expect(judge(startHeight, staircase).solved).toBe(true);
  }
});

test('nailed-down heights survive exactly one of the rooms', () => {
  expect(judge(2, fixedHeights).solved).toBe(true);
  expect(judge(3, fixedHeights).solved).toBe(false);
});

test('judgeAll refuses code that only fits one room, and names the room', () => {
  const verdict = judgeAll(fixedHeights);
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('first bar 3');
});

test('judgeAll passes code that reads the height and grows it', () => {
  expect(judgeAll(staircase).solved).toBe(true);
});

test('runProgram hands back the commands it ran, in order', () => {
  const { commands } = runProgram(startWorld(2), () => {
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
  expect(robot.startHeight()).toBe(1);
});
