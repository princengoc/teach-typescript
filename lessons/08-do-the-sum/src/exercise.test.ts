import { expect, test } from 'vitest';
import {
  backHalf,
  bandRow,
  paintBackHalf,
  paintBandRows,
  paintStripes,
  stripe,
} from './exercise';
import {
  backHalfVariants,
  bandRowsVariants,
  checkBackHalf,
  checkBandRow,
  checkStripe,
  judge,
  stripeVariants,
} from './harness/task';

test('rung 1: backHalf says yes to exactly the back half', () => {
  expect(checkBackHalf(backHalf).solved).toBe(true);
});

test('rung 1: the back half lights, in both rooms', () => {
  for (const variant of backHalfVariants) {
    expect(judge(variant, paintBackHalf).solved).toBe(true);
  }
});

test('rung 2: stripe says yes to exactly every other square', () => {
  expect(checkStripe(stripe).solved).toBe(true);
});

test('rung 2: every other square lights, in both rooms', () => {
  for (const variant of stripeVariants) {
    expect(judge(variant, paintStripes).solved).toBe(true);
  }
});

test('rung 3: bandRow says yes to exactly the rows from lo to hi', () => {
  expect(checkBandRow(bandRow).solved).toBe(true);
});

test('rung 3: the band of rows lights, ends included, in both rooms', () => {
  for (const variant of bandRowsVariants) {
    expect(judge(variant, paintBandRows).solved).toBe(true);
  }
});
