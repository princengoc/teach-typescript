import { expect, test } from 'vitest';
import { paintStaircase } from './exercise';
import { judge, longRoom, shortRoom } from './harness/task';

test('the staircase stands when the first row is 2', () => {
  expect(judge(shortRoom, paintStaircase).solved).toBe(true);
});

test('the same code builds the staircase when the first row is 3', () => {
  expect(judge(longRoom, paintStaircase).solved).toBe(true);
});
