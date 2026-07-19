import { expect, test } from 'vitest';
import { opens, opensOn, sign } from './the-toll-gate';

test('task 1: the gate opens for a small load', () => {
  expect(opens(1)).toBe(true);
  expect(opens(4)).toBe(true);
  expect(opens(5)).toBe(false);
});

test('task 2: market day shuts it whatever the load', () => {
  expect(opensOn(1, false)).toBe(true);
  expect(opensOn(9, false)).toBe(false);
  expect(opensOn(1, true)).toBe(false);
  expect(opensOn(9, true)).toBe(false);
});

test('task 3: the word on the gate', () => {
  expect(sign(1, false)).toBe('open');
  expect(sign(9, false)).toBe('closed');
  expect(sign(1, true)).toBe('closed');
});
