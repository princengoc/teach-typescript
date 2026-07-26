import { expect, test } from 'vitest';
import { climbAndFloor, matchBars, paintFloatingRow } from './exercise';
import {
  climbFloorVariants,
  floatingRowVariants,
  judge,
  matchBarsVariants,
} from './harness/task';

test('rung 1: the floating row is as long as the gap, in both rooms', () => {
  for (const variant of floatingRowVariants) {
    expect(judge(variant, paintFloatingRow).solved).toBe(true);
  }
});

test('rung 2: three bars all match the first, in both rooms', () => {
  for (const variant of matchBarsVariants) {
    expect(judge(variant, matchBars).solved).toBe(true);
  }
});

test('rung 3: the floor is as long as the bar was tall, in both rooms', () => {
  for (const variant of climbFloorVariants) {
    expect(judge(variant, climbAndFloor).solved).toBe(true);
  }
});
