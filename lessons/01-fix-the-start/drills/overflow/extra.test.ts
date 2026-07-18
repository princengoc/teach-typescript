import { expect, test } from 'vitest';
import { gateX, predictedBirdX, predictedBirdY } from './extra';
import { garden } from './garden';

test('you predicted the bird x', () => {
  expect(predictedBirdX).toBe(garden.bird.x);
});

test('you predicted the bird y', () => {
  expect(predictedBirdY).toBe(garden.bird.y);
});

test('gateX reads the gate x', () => {
  expect(gateX).toBe(garden.gate.x);
});
