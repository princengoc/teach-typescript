import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { atticDoorY, cellarDoorX, kitchenDoorX } from './answers';
import { attic, cellar, kitchen } from './rooms';

test('kitchenDoorX reads the kitchen door x', () => {
  expect(kitchenDoorX).toBe(kitchen.door.x);
});

test('atticDoorY reads the attic door y', () => {
  expect(atticDoorY).toBe(attic.door.y);
});

test('cellarDoorX reads the cellar door x', () => {
  expect(cellarDoorX).toBe(cellar.door.x);
});

test('answers.ts uses dots, not number literals', () => {
  const source = readFileSync(new URL('./answers.ts', import.meta.url), 'utf8');
  const body = source.slice(source.indexOf('export'));
  expect(body).not.toMatch(/=\s*\d/);
});
