import { expect, test } from 'vitest';
import { robot, script } from './robot';
import { judge, lessonDoor, otherDoors, shelfCells, targetWorld } from './task';
import type { Command } from './types';
import { paintedCells } from './world';

test('the target holds exactly the nine shelf cells', () => {
  const painted = paintedCells(targetWorld(lessonDoor));
  expect(painted.length).toBe(9);
  for (const cell of shelfCells(lessonDoor)) {
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

test('every door leaves room for all three shelves', () => {
  for (const door of [lessonDoor, ...otherDoors]) {
    expect(paintedCells(targetWorld(door)).length).toBe(9);
  }
});

test('a move that does not come home reads as drift, not as a wrong shelf', () => {
  const verdict = judge(lessonDoor, shortMove(false));
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('leave the robot where it found it');
});

test('the same mistake three times names the definition', () => {
  const verdict = judge(lessonDoor, shortMove(true));
  expect(verdict.solved).toBe(false);
  expect(verdict.message).toContain('Fix paintShelf once');
});

test('walk records one step per unit', () => {
  const before = script().length;
  robot.walk(3);
  expect(script().slice(before)).toEqual([
    { kind: 'step' },
    { kind: 'step' },
    { kind: 'step' },
  ]);
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

// Two shelves of two instead of three, three times over: once without the
// walk home, once with it.
function shortMove(comesHome: boolean): Command[] {
  const commands: Command[] = [{ kind: 'turn', hand: 'left' }];
  const shelf: Command[] = [
    { kind: 'paint' },
    { kind: 'step' },
    { kind: 'paint' },
  ];
  const home: Command[] = [
    { kind: 'turn', hand: 'left' },
    { kind: 'turn', hand: 'left' },
    { kind: 'step' },
    { kind: 'turn', hand: 'left' },
    { kind: 'turn', hand: 'left' },
  ];
  const join: Command[] = [
    { kind: 'turn', hand: 'right' },
    { kind: 'step' },
    { kind: 'step' },
    { kind: 'turn', hand: 'left' },
  ];
  for (let i = 0; i < 3; i += 1) {
    commands.push(...shelf);
    if (comesHome) commands.push(...home);
    if (i < 2) commands.push(...join);
  }
  return commands;
}
