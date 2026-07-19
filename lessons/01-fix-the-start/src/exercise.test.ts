import { expect, test } from 'vitest';
import { door, grid, startX, startY } from './exercise';
import { goalDoor, placementSolved } from './harness/task';

const start = { x: startX, y: startY };

test('the room is big enough to hold the door', () => {
  expect(grid.width).toBeGreaterThan(door.x);
  expect(grid.height).toBeGreaterThan(door.y);
});

test('the door sits on the goal square', () => {
  expect(door.x).toBe(goalDoor.x);
  expect(door.y).toBe(goalDoor.y);
});

test('the robot starts on the door', () => {
  expect(start.x).toBe(door.x);
  expect(start.y).toBe(door.y);
});

test('the whole scene is solved', () => {
  expect(placementSolved({ grid, door, start, goal: goalDoor })).toBe(true);
});
