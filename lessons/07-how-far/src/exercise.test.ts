import { expect, test } from 'vitest';
import { matchRows, paintAndMatch, paintFloatingRow } from './exercise';
import {
  floatingRowVariants,
  judge,
  matchRowsVariants,
  paintAndMatchVariants,
} from './harness/task';

test('rung 1: the floating row is as long as the gap, in both rooms', () => {
  for (const variant of floatingRowVariants) {
    expect(judge(variant, paintFloatingRow).solved).toBe(true);
  }
});

test('rung 2: three rows all match the gap, in both rooms', () => {
  for (const variant of matchRowsVariants) {
    expect(judge(variant, matchRows).solved).toBe(true);
  }
});

test('rung 3: the row below matches the row you counted, in both rooms', () => {
  for (const variant of paintAndMatchVariants) {
    expect(judge(variant, paintAndMatch).solved).toBe(true);
  }
});
