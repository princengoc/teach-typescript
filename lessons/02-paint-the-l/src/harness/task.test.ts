import { expect, test } from 'vitest';
import { robot, script } from './robot';
import { judge, lCells, lessonDoor, otherDoors, targetWorld } from './task';
import { paintedCells } from './world';

test('the target holds exactly the five L cells', () => {
  const painted = paintedCells(targetWorld(lessonDoor));
  expect(painted.length).toBe(5);
  for (const cell of lCells(lessonDoor)) {
    expect(painted).toContain(`${cell.x},${cell.y}`);
  }
});

test('an empty script is not solved', () => {
  expect(judge(lessonDoor, []).solved).toBe(false);
});

test('walking off the grid crashes rather than solving', () => {
  const commands = Array.from(
    { length: 20 },
    () => ({ kind: 'step' }) as const,
  );
  const verdict = judge(lessonDoor, commands);
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('wall');
});

test('every door leaves room for the whole L', () => {
  for (const door of [lessonDoor, ...otherDoors]) {
    expect(paintedCells(targetWorld(door)).length).toBe(5);
  }
});

test('the facade records one command per call, in order', () => {
  const before = script().length;
  robot.paint();
  robot.turnRight();
  expect(script().slice(before)).toEqual([
    { kind: 'paint' },
    { kind: 'turn', hand: 'right' },
  ]);
});
