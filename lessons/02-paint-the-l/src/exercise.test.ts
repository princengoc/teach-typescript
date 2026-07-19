import { expect, test } from 'vitest';
import './exercise';
import { script } from './harness/robot';
import { judge, lessonDoor, otherDoors } from './harness/task';

test('the script paints the L from the lesson door', () => {
  expect(judge(lessonDoor, script()).solved).toBe(true);
});

test('the same script paints the L from any door', () => {
  for (const door of otherDoors) {
    expect(judge(door, script()).solved).toBe(true);
  }
});
