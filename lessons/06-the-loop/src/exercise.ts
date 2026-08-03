import { nextRow, paintCells } from './harness/moves';
import { robot } from './harness/robot';
import type { Room } from './harness/types';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paintCells(n)      paints `n` squares in a row, starting on the square...
//   nextRow()          carries the robot to the first square of the row...
//   robot.paint()      paints the square the robot stands on
//   robot.step()       moves the robot one square forward
//   robot.walk(steps)  walks the robot `steps` squares forward
//   robot.turnLeft()   turns the robot a quarter turn to the left
//   robot.turnRight()  turns the robot a quarter turn to the right
//   robot.wallAhead()  a sensor: true when the next step lands on a wall
//   room.side          how long one side of this room's square is
//   room.width         how many squares across the box reaches
//   room.height        how many rows down the box reaches
//   room.len           how many squares long the first row is
// --- end of your kit ---

// The intro slide (preview, on the right) has a worked for loop and a worked
// recursion. Copy the shape, not the numbers. Each rung below paints one thing
// once. Turn it into the whole figure.

// RUNG 1 -- a square: one side is paintCells(room.side) and the turn that
// starts the next one. Four of those, and the square closes.
export function paintSquare(room: Room): void {
  paintCells(room.side);
  robot.turnRight();
}

// RUNG 2 -- a rectangle: a long side then a short one, twice round.
export function paintRectangle(room: Room): void {
  paintCells(room.width);
  robot.turnRight();
}

// RUNG 3 -- the staircase, with a for loop. room.height rows, one under the
// next; the first is room.len long and each one after is one longer.
export function paintStaircaseLoop(room: Room): void {
  paintCells(room.len);
  nextRow();
}

// RUNG 4 -- the same staircase, with recursion: one row, then the rest of
// them. Write a helper that calls itself, and stop it when no rows are left.
export function paintStaircaseRec(room: Room): void {
  paintCells(room.len);
}

// RUNG 5 -- the blind square. The same square as rung 1, but the side is
// hidden: a ? where the number was, a new size every run. This room hands you
// no numbers at all, so paintCells has no length to take. One new tool:
// robot.wallAhead() is true when the next step lands on a wall. Paint the whole
// square with recursion. It must work for every side.
export function paintSquareBlind(): void {
  robot.paint();
}
