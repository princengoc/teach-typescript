import { expect, test } from 'vitest';
import { fenceLength, lawnArea } from './fence-and-lawn';

test('task 1: the fence goes round every side', () => {
  expect(fenceLength(1)).toBe(4);
  expect(fenceLength(5)).toBe(20);
  expect(fenceLength(12)).toBe(48);
});

test('task 2: the lawn fills the whole square', () => {
  expect(lawnArea(1)).toBe(1);
  expect(lawnArea(5)).toBe(25);
  expect(lawnArea(12)).toBe(144);
});
