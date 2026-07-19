import { expect, test } from 'vitest';
import { isBig, isTwo, isWide } from './the-broken-gate';

test('task 1: isWide says whether there is a gap at all', () => {
  expect(isWide(4)).toBe(true);
  expect(isWide(0)).toBe(false);
});

test.skip('task 2: isBig answers for every gap', () => {
  expect(isBig(20)).toBe(true);
  expect(isBig(3)).toBe(false);
});

test.skip('task 3: isTwo finds the number 2', () => {
  expect(isTwo(2)).toBe(true);
  expect(isTwo(3)).toBe(false);
});
