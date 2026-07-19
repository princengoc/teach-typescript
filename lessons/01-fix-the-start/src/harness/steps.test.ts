import { expect, test } from 'vitest';
import { checkDots, checkPlacement, usesDots } from './steps';
import { goalDoor } from './task';

const dotted = `
export const kitchenDoorX = kitchen.door.x;
export const atticDoorY = attic.door.y;
export const cellarDoorX = cellar.door.x;
`;

const typed = `
export const kitchenDoorX = 1;
export const atticDoorY = 0;
export const cellarDoorX = 4;
`;

test('usesDots accepts property reads and rejects typed numbers', () => {
  expect(usesDots(dotted)).toBe(true);
  expect(usesDots(typed)).toBe(false);
});

test('right values typed by hand still fail part 2', () => {
  const values = { kitchenDoorX: 1, atticDoorY: 0, cellarDoorX: 4 };
  expect(checkDots(values, typed).pass).toBe(false);
  expect(checkDots(values, dotted).pass).toBe(true);
});

test('a door on the goal with the robot elsewhere reports progress', () => {
  const result = checkPlacement({
    grid: { width: 8, height: 6 },
    door: goalDoor,
    start: { x: 0, y: 0 },
    goal: goalDoor,
  });
  expect(result.pass).toBe(false);
  expect(result.tone).toBe('progress');
});
