import { expect, test } from 'vitest';
import { oneShelf, shelfName, twoShelves } from './the-broken-recipe';

test('task 1: twoShelves hands back the squares in two shelves', () => {
  expect(twoShelves()).toBe(12);
});

test('task 2: oneShelf counts a shelf 3 long', () => {
  expect(oneShelf()).toBe(9);
});

test('task 3: shelfName says what it is', () => {
  expect(shelfName(4)).toBe('a shelf of 4');
});
