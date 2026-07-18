import { expect, test } from 'vitest';
import { doorCode } from './door';

test('the door code is 24', () => {
  expect(doorCode).toBe(24);
});
