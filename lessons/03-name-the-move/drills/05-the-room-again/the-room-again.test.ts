import { expect, test } from 'vitest';
import { floorArea, paintCost } from './the-room-again';

test('task 1: the floor is width by height', () => {
  expect(floorArea({ width: 8, height: 6 })).toBe(48);
  expect(floorArea({ width: 1, height: 9 })).toBe(9);
});

test.skip('task 2: painting costs 2 a square', () => {
  expect(paintCost({ width: 8, height: 6 })).toBe(96);
  expect(paintCost({ width: 3, height: 3 })).toBe(18);
});
