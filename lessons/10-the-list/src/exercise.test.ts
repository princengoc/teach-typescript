import { expect, test } from 'vitest';
import { paintChart, paintChartByHand, paintTallBars } from './exercise';
import {
  byHandVariants,
  chartVariants,
  judge,
  tallVariants,
} from './harness/task';

test('rung 1: the list draws the chart, in both rooms', () => {
  for (const variant of chartVariants) {
    expect(judge(variant, paintChart).solved).toBe(true);
  }
});

test('rung 2: the same chart, bars built by hand, in both rooms', () => {
  for (const variant of byHandVariants) {
    expect(judge(variant, paintChartByHand).solved).toBe(true);
  }
});

test('rung 3: only the tall bars are painted, and the chart stays lined up', () => {
  for (const variant of tallVariants) {
    expect(judge(variant, paintTallBars).solved).toBe(true);
  }
});
