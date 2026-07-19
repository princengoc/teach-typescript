import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import {
  atticDoorY,
  cellarDoorX,
  door,
  grid,
  kitchenDoorX,
  parkX,
  parkY,
  predictedDoorX,
  predictedDoorY,
  predictedWidth,
  startX,
  startY,
} from './exercise';
import {
  checkDots,
  checkPark,
  checkPlacement,
  checkPredictions,
} from './harness/steps';
import { goalDoor } from './harness/task';

const source = readFileSync(new URL('./exercise.ts', import.meta.url), 'utf8');

test('part 1: the predictions match the room', () => {
  const result = checkPredictions({
    width: predictedWidth,
    doorX: predictedDoorX,
    doorY: predictedDoorY,
  });
  expect(result.pass, result.message).toBe(true);
});

test('part 2: the three names are read with dots', () => {
  const result = checkDots({ kitchenDoorX, atticDoorY, cellarDoorX }, source);
  expect(result.pass, result.message).toBe(true);
});

test('part 3: the robot parks on the charger', () => {
  const result = checkPark(parkX, parkY);
  expect(result.pass, result.message).toBe(true);
});

test('part 4: the room is built and the robot is on the door', () => {
  const result = checkPlacement({
    grid,
    door,
    start: { x: startX, y: startY },
    goal: goalDoor,
  });
  expect(result.pass, result.message).toBe(true);
});
