import { expect, test } from 'vitest';
import { pressesFor, squaresIn } from './the-shelf-again';

test('task 1: squares in a run of shelves', () => {
  expect(squaresIn(1)).toBe(3);
  expect(squaresIn(3)).toBe(9);
  expect(squaresIn(10)).toBe(30);
});

test.skip('task 2: calls to paint them', () => {
  expect(pressesFor(1)).toBe(5);
  expect(pressesFor(2)).toBe(14);
  expect(pressesFor(3)).toBe(23);
});
