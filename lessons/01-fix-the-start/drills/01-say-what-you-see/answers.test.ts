import { expect, test } from 'vitest';
import { predictedDoorX, predictedDoorY, predictedWidth } from './answers';
import { room } from './room';

test('you predicted the width of the room', () => {
  expect(predictedWidth).toBe(room.width);
});

test('you predicted the door x', () => {
  expect(predictedDoorX).toBe(room.door.x);
});

test('you predicted the door y', () => {
  expect(predictedDoorY).toBe(room.door.y);
});
