import { expect, test } from 'vitest';
import { paintStaircase } from './exercise';
import { judge } from './harness/task';

test('the staircase stands when the first bar is 2', () => {
  expect(judge(2, paintStaircase).solved).toBe(true);
});

test('the same code builds the staircase when the first bar is 3', () => {
  expect(judge(3, paintStaircase).solved).toBe(true);
});
