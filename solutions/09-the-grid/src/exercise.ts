import { next, nextRow, paint } from './harness/moves';
import type { Room } from './harness/types';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paint()      paints the square the robot stands on
//   next()       steps forward to the next square
//   nextRow()    carries the robot to the first square of the row below,...
//   room.width   how many squares across the box reaches
//   room.height  how many rows down the box reaches
// --- end of your kit ---

// RUNG 1 -- fill the box: one loop for the rows, one for the squares in a row.
export function fillBox(room: Room): void {
  for (let y = 0; y < room.height; y += 1) {
    for (let x = 0; x < room.width; x += 1) {
      paint();
      next();
    }
    nextRow();
  }
}

// RUNG 2 -- the checkerboard. The rule reads both counters at once.
function black(x: number, y: number): boolean {
  return (x + y) % 2 === 0;
}

export function paintChecker(room: Room): void {
  for (let y = 0; y < room.height; y += 1) {
    for (let x = 0; x < room.width; x += 1) {
      if (black(x, y)) paint();
      next();
    }
    nextRow();
  }
}

// RUNG 3 -- the staircase. The inner loop stops at a number worked out from the
// row it is on.
function rowWidth(y: number, room: Room): number {
  return room.width - y;
}

export function paintStaircase(room: Room): void {
  for (let y = 0; y < room.height; y += 1) {
    for (let x = 0; x < rowWidth(y, room); x += 1) {
      paint();
      next();
    }
    nextRow();
  }
}
