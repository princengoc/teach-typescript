import { expect, test } from 'vitest';
import { paintBackHalf, paintBandRows, paintStripes } from './exercise';
import {
  backHalfVariants,
  bandRowsVariants,
  judge,
  stripeVariants,
} from './harness/task';

test('rung 1: the back half lights, in both rooms', () => {
  for (const variant of backHalfVariants) {
    expect(judge(variant, paintBackHalf).solved).toBe(true);
  }
});

test('rung 2: every other square lights, in both rooms', () => {
  for (const variant of stripeVariants) {
    expect(judge(variant, paintStripes).solved).toBe(true);
  }
});

test('rung 3: the band of rows lights, ends included, in both rooms', () => {
  for (const variant of bandRowsVariants) {
    expect(judge(variant, paintBandRows).solved).toBe(true);
  }
});
