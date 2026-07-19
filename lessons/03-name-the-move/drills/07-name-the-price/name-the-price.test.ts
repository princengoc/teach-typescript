import { expect, test } from 'vitest';
import { price, priceWithDelivery } from './name-the-price';

test('task 1: seven an item', () => {
  expect(price(0)).toBe(0);
  expect(price(1)).toBe(7);
  expect(price(6)).toBe(42);
});

test.skip('task 2: four for delivery', () => {
  expect(priceWithDelivery(1)).toBe(11);
  expect(priceWithDelivery(6)).toBe(46);
});
