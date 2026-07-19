import { expect, test } from 'vitest';
import {
  answer1,
  answer2,
  answer3,
  isExactly,
  isLong,
  isShort,
} from './true-or-false';

test('task 1: you read isLong(4) right', () => {
  expect(answer1).toBe(isLong(4));
});

test('task 2: you read isExactly(3, 3) right', () => {
  expect(answer2).toBe(isExactly(3, 3));
});

test('task 3: you read isShort(9) right', () => {
  expect(answer3).toBe(isShort(9));
});
