import { expect, test } from 'vitest';
import { fillBox, paintChecker, paintStaircase } from './exercise';
import {
  checkerVariants,
  fillVariants,
  judge,
  stairVariants,
} from './harness/task';

test('rung 1: every square of the box lights, in both rooms', () => {
  for (const variant of fillVariants) {
    expect(judge(variant, fillBox).solved).toBe(true);
  }
});

test('rung 2: the checkerboard lights, in both rooms', () => {
  for (const variant of checkerVariants) {
    expect(judge(variant, paintChecker).solved).toBe(true);
  }
});

test('rung 3: the staircase steps down, in both rooms', () => {
  for (const variant of stairVariants) {
    expect(judge(variant, paintStaircase).solved).toBe(true);
  }
});
