import { expect, test } from 'vitest';
import { stepsBetween, thereAndBack } from './how-far';

test('task 1: crossing a shelf', () => {
  expect(stepsBetween(1)).toBe(0);
  expect(stepsBetween(3)).toBe(2);
  expect(stepsBetween(10)).toBe(9);
});

test('task 2: crossing it and coming home', () => {
  expect(thereAndBack(1)).toBe(0);
  expect(thereAndBack(3)).toBe(4);
  expect(thereAndBack(10)).toBe(18);
});
