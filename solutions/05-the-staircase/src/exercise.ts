import { nextRow, paintCells } from './harness/moves';
import type { Room } from './harness/types';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paintCells(n)  paints `n` squares in a row, starting on the square the...
//   nextRow()      carries the robot to the first square of the row below,...
//   room.len       how many squares long the first row is
// --- end of your kit ---

// The room wants a staircase: three rows, each one square longer than the one
// above it. paintCells(n) paints n squares in a row. nextRow() drops to the
// row below and puts the robot back at its start.
//
// You do not get to see how long the first row is; the room decides, and
// room.len hands you the number. Each row after that is one longer.
export function paintStaircase(room: Room): void {
  let len = room.len;
  paintCells(len);
  nextRow();
  len += 1;
  paintCells(len);
  nextRow();
  len += 1;
  paintCells(len);
}
