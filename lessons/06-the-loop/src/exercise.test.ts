import { expect, test } from 'vitest';
import {
  paintRectangle,
  paintSquare,
  paintSquareBlind,
  paintStaircaseLoop,
  paintStaircaseRec,
} from './exercise';
import {
  blindVariants,
  judge,
  rectVariants,
  squareVariants,
  stairVariants,
} from './harness/task';

test('the square stands in both rooms', () => {
  for (const variant of squareVariants) {
    expect(judge(variant, paintSquare).solved).toBe(true);
  }
});

test('the rectangle stands in both rooms', () => {
  for (const variant of rectVariants) {
    expect(judge(variant, paintRectangle).solved).toBe(true);
  }
});

test('the for-loop staircase stands in both rooms', () => {
  for (const variant of stairVariants) {
    expect(judge(variant, paintStaircaseLoop).solved).toBe(true);
  }
});

test('the recursive staircase stands in both rooms', () => {
  for (const variant of stairVariants) {
    expect(judge(variant, paintStaircaseRec).solved).toBe(true);
  }
});

test('the blind square stands in every room, side never told', () => {
  for (const variant of blindVariants) {
    expect(judge(variant, paintSquareBlind).solved).toBe(true);
  }
});
