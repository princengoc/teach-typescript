import { next, paint } from './harness/moves';
import type { Room } from './harness/types';

// This lesson you write the RULE, and the robot follows it at every square. A
// rule is a function that gives back true or false. You loop down the lane, and
// where the rule says true, you paint.

// RUNG 1 -- the back half. The loop is written for you; the rule is yours.
// A square is in the back half when its index is at least halfway along.
function backHalf(i: number, len: number): boolean {
  return i >= len / 2;
}

export function paintBackHalf(room: Room): void {
  for (let i = 0; i < room.len; i += 1) {
    if (backHalf(i, room.len)) paint();
    next();
  }
}

// RUNG 2 -- stripes. Every other square is an even one: i % 2 leaves 0.
function stripe(i: number): boolean {
  return i % 2 === 0;
}

export function paintStripes(room: Room): void {
  for (let i = 0; i < room.len; i += 1) {
    if (stripe(i)) paint();
    next();
  }
}

// RUNG 3 -- the band. A square is in the band when it is at or past lo AND at or
// before hi. && is true only when both tests are.
function band(i: number, lo: number, hi: number): boolean {
  return i >= lo && i <= hi;
}

export function paintBand(room: Room): void {
  for (let i = 0; i < room.len; i += 1) {
    if (band(i, room.lo, room.hi)) paint();
    next();
  }
}
