import { expect, test } from 'vitest';
import {
  cellNumber,
  gap,
  near,
  paintBox,
  paintDiamond,
  paintPicture,
  wanted,
} from './exercise';
import {
  boxVariants,
  checkCellNumber,
  checkGap,
  checkRule,
  diamondVariants,
  judge,
  pictureVariants,
} from './harness/task';

test('rung 1: the walk fills the box, in both rooms', () => {
  for (const variant of boxVariants) {
    expect(judge(variant, paintBox).solved).toBe(true);
  }
});

test('rung 2: gap is a distance, whichever way round the numbers come', () => {
  expect(checkGap(gap).solved).toBe(true);
});

test('rung 2: near says yes to exactly the squares of the diamond', () => {
  expect(checkRule(near, diamondVariants).solved).toBe(true);
});

test('rung 2: the diamond comes out, in both rooms', () => {
  for (const variant of diamondVariants) {
    expect(judge(variant, paintDiamond).solved).toBe(true);
  }
});

test('rung 3: cellNumber numbers the squares in reading order', () => {
  expect(checkCellNumber(cellNumber).solved).toBe(true);
});

test('rung 3: wanted says yes to exactly the squares on the list', () => {
  expect(checkRule(wanted, pictureVariants).solved).toBe(true);
});

test('rung 3: the picture comes out, in both rooms', () => {
  for (const variant of pictureVariants) {
    expect(judge(variant, paintPicture).solved).toBe(true);
  }
});
