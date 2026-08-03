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

// This lesson: a loop inside a loop. The inner loop does one row. The outer
// loop runs the inner one again for every row, so a row of code paints a box.

// RUNG 1 -- fill the box. The inner loop is written for you: it paints one row,
// left to right, then nextRow() drops to the row below. Your job is the loop
// around it.
//
// TODO: right now the top row is painted and the rest of the box is empty. Wrap
// these lines in an outer loop that counts y from 0 up to room.height, so the
// row you already have runs once for every row.
export function fillBox(room: Room): void {
  for (let x = 0; x < room.width; x += 1) {
    paint();
    next();
  }
  nextRow();
}

// RUNG 2 -- the checkerboard: every other square, so a painted square never
// touches another one side-on. Now you write both loops and the rule.
//
// TODO: write a rule black(x, y) that is true when x + y is even
// ((x + y) % 2 === 0), then the two loops -- rows outside, squares inside --
// that paint where it says yes. Right now the top row is walked and nothing is
// painted.
export function paintChecker(room: Room): void {
  for (let x = 0; x < room.width; x += 1) {
    next();
  }
}

// RUNG 3 -- the staircase. Row 0 is the full width, row 1 is one square
// shorter, row 2 two shorter, so the box comes out as steps.
//
// TODO, two jobs. First the rule: rowWidth says how many squares a row paints,
// and it has the sign wrong -- row y should be y squares SHORTER than the top,
// not longer. Then the loops: the inner one below stops at the number rowWidth
// hands back, but it paints nothing and it always asks about row 0. Make it
// paint, wrap it in a loop over the rows, hand that row's own y to rowWidth,
// and call nextRow() at the foot.
function rowWidth(y: number, room: Room): number {
  return room.width + y;
}

export function paintStaircase(room: Room): void {
  for (let x = 0; x < rowWidth(0, room); x += 1) {
    next();
  }
}
