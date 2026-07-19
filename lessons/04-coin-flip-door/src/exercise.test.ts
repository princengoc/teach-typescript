import { expect, test } from 'vitest';
import { paintTheRoom } from './exercise';
import { judge, leftDoor, rightDoor } from './harness/task';

test('the shelf is painted when the door is in the right wall', () => {
  expect(judge(rightDoor, paintTheRoom).solved).toBe(true);
});

test('the same code paints the shelf when the door is in the left wall', () => {
  expect(judge(leftDoor, paintTheRoom).solved).toBe(true);
});
