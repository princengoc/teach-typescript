import { expect, test } from 'vitest';
import { isLong, isMiddling, isShort } from './long-or-short';

test('task 1: a long shelf', () => {
  expect(isLong(5)).toBe(true);
  expect(isLong(4)).toBe(false);
  expect(isLong(1)).toBe(false);
});

test.skip('task 2: a short shelf', () => {
  expect(isShort(2)).toBe(true);
  expect(isShort(3)).toBe(false);
  expect(isShort(9)).toBe(false);
});

test.skip('task 3: the ones in between', () => {
  expect(isMiddling(3)).toBe(true);
  expect(isMiddling(4)).toBe(true);
  expect(isMiddling(2)).toBe(false);
  expect(isMiddling(5)).toBe(false);
});
