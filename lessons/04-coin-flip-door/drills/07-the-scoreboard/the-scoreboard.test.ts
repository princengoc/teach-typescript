import { expect, test } from 'vitest';
import { isDraw, isWin, result } from './the-scoreboard';

test('task 1: a win', () => {
  expect(isWin(5, 3)).toBe(true);
  expect(isWin(3, 5)).toBe(false);
  expect(isWin(4, 4)).toBe(false);
});

test.skip('task 2: a draw', () => {
  expect(isDraw(4, 4)).toBe(true);
  expect(isDraw(4, 5)).toBe(false);
});

test.skip('task 3: the three answers', () => {
  expect(result(5, 3)).toBe('win');
  expect(result(4, 4)).toBe('draw');
  expect(result(3, 5)).toBe('lose');
});
