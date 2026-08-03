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
//
// The first row is done. Your turn: two more, each one longer. You will need
// to add one to len before each -- and a const cannot change. Fix that first,
// then paint.
export function paintStaircase(room: Room): void {
  const len = room.len;
  paintCells(len);
  nextRow();
}
