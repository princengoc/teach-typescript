import { expect, test } from 'vitest';
import { add, answer1, answer2, answer3, bigger, twice } from './what-it-says';

test('task 1: you read twice(4) right', () => {
  expect(answer1).toBe(twice(4));
});

test('task 2: you read bigger(3) right', () => {
  expect(answer2).toBe(bigger(3));
});

test('task 3: you read add(twice(2), bigger(0)) right', () => {
  expect(answer3).toBe(add(twice(2), bigger(0)));
});
