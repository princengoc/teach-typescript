import { expect, test } from 'vitest';
import {
  backToRowStart,
  nextRow,
  paintBand,
  paintBands,
  paintChart,
  paintRun,
} from './exercise';
import {
  bandsVariants,
  chartVariants,
  checkBackToRowStart,
  checkNextRow,
  checkPaintBand,
  judge,
  runVariants,
} from './harness/task';

test('rung 1: paintCells paints exactly n squares, in both lanes', () => {
  for (const variant of runVariants) {
    expect(judge(variant, paintRun).solved).toBe(true);
  }
});

test('rung 2: backToRowStart walks back to the wall and stops there', () => {
  expect(checkBackToRowStart(backToRowStart).solved).toBe(true);
});

test('rung 2: nextRow lands on the first square of the row below', () => {
  expect(checkNextRow(nextRow).solved).toBe(true);
});

test('rung 2: the chart comes out, in both rooms', () => {
  for (const variant of chartVariants) {
    expect(judge(variant, paintChart).solved).toBe(true);
  }
});

test('rung 3: paintBand paints one band when called on its own', () => {
  expect(checkPaintBand(paintBand).solved).toBe(true);
});

test('rung 3: the bands come out, however deep the room wants them', () => {
  for (const variant of bandsVariants) {
    expect(judge(variant, paintBands).solved).toBe(true);
  }
});
