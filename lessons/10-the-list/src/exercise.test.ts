import { expect, test } from 'vitest';
import { paintChart, paintTallBars, paintTallest } from './exercise';
import {
  chartVariants,
  judge,
  tallestVariants,
  tallVariants,
} from './harness/task';

test('rung 1: the list draws the chart, in both rooms', () => {
  for (const variant of chartVariants) {
    expect(judge(variant, paintChart).solved).toBe(true);
  }
});

test('rung 2: only the tall bars are painted, and the chart stays lined up', () => {
  for (const variant of tallVariants) {
    expect(judge(variant, paintTallBars).solved).toBe(true);
  }
});

test('rung 3: the row matches the longest bar, wherever it sits in the list', () => {
  for (const variant of tallestVariants) {
    expect(judge(variant, paintTallest).solved).toBe(true);
  }
});
