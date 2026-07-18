import { expect, test } from 'vitest';
import { parkX, parkY } from './spot';

test('the charger is at x 7', () => {
  expect(parkX).toBe(7);
});

test('the charger is at y 5', () => {
  expect(parkY).toBe(5);
});
