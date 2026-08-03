import { next, nextRow, paint, paintCells } from './harness/moves';
import type { Room } from './harness/types';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paint()        paints the square the robot stands on
//   next()         steps forward to the next square
//   paintCells(n)  paints `n` squares in a row, starting on the square the...
//   nextRow()      carries the robot to the first square of the row below,...
//   room.width     how many squares across the box reaches
//   room.height    how many rows down the box reaches
//   room.lo        the first row of the band
//   room.hi        the last row of the band
// --- end of your kit ---

// RUNG 1 -- the back half. The loop is written for you; the rule is yours.
// A square is in the back half when its index is at least halfway along.
export function backHalf(i: number, width: number): boolean {
  return i >= width / 2;
}

export function paintBackHalf(room: Room): void {
  for (let i = 0; i < room.width; i += 1) {
    if (backHalf(i, room.width)) paint();
    next();
  }
}

// RUNG 2 -- stripes. Every other square is an even one: i % 2 leaves 0.
export function stripe(i: number): boolean {
  return i % 2 === 0;
}

export function paintStripes(room: Room): void {
  for (let i = 0; i < room.width; i += 1) {
    if (stripe(i)) paint();
    next();
  }
}

// RUNG 3 -- the band of rows. The same rule, asked about a row: it is in the
// band when it is at or past lo AND at or before hi. && is true only when both
// tests are. Every row drops, painted or not, so the box keeps its shape.
export function bandRow(y: number, room: Room): boolean {
  return y >= room.lo && y <= room.hi;
}

export function paintBandRows(room: Room): void {
  for (let y = 0; y < room.height; y += 1) {
    if (bandRow(y, room)) paintCells(room.width);
    nextRow();
  }
}
