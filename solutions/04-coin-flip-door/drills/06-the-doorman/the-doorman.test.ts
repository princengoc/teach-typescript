import { expect, test } from 'vitest';
import { getsIn, staysOut } from './the-doorman';

test('task 1: no key, no entry', () => {
  expect(staysOut(false)).toBe(true);
  expect(staysOut(true)).toBe(false);
});

test('task 2: the lock decides whether the key matters', () => {
  expect(getsIn(true, true)).toBe(true);
  expect(getsIn(false, true)).toBe(false);
  expect(getsIn(true, false)).toBe(true);
  expect(getsIn(false, false)).toBe(true);
});
