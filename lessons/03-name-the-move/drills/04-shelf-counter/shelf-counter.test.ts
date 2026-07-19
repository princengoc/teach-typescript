import { expect, test } from 'vitest';
import { squares, squaresOf } from './shelf-counter';

test('task 1: three shelves of three', () => {
  expect(squares(3)).toBe(9);
});

test.skip('task 1 again: any number of shelves', () => {
  expect(squares(0)).toBe(0);
  expect(squares(1)).toBe(3);
  expect(squares(7)).toBe(21);
  expect(squares(100)).toBe(300);
});

test.skip('task 2: shelves of any length', () => {
  expect(squaresOf(3, 3)).toBe(9);
  expect(squaresOf(4, 2)).toBe(8);
  expect(squaresOf(2, 10)).toBe(20);
  expect(squaresOf(5, 0)).toBe(0);
});
