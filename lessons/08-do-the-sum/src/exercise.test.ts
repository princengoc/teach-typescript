import { expect, test } from 'vitest';
import { paintBackHalf, paintBand, paintStripes } from './exercise';
import {
  backHalfVariants,
  bandVariants,
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

test('rung 3: the band lights, ends included, in both rooms', () => {
  for (const variant of bandVariants) {
    expect(judge(variant, paintBand).solved).toBe(true);
  }
});
