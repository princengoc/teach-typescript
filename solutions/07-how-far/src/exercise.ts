import { next, nextRow, paint, paintCells } from './harness/moves';
import { robot } from './harness/robot';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paint()            paints the square the robot stands on
//   next()             steps forward to the next square
//   paintCells(n)      paints `n` squares in a row, starting on the square...
//   nextRow()          carries the robot to the first square of the row...
//   robot.paint()      paints the square the robot stands on
//   robot.step()       moves the robot one square forward
//   robot.walk(steps)  walks the robot `steps` squares forward
//   robot.turnLeft()   turns the robot a quarter turn to the left
//   robot.turnRight()  turns the robot a quarter turn to the right
//   robot.wallAhead()  a sensor: true when the next step lands on a wall
// --- end of your kit ---

// RUNG 1 -- measure, then build.
// Feel your way to the wall, counting the squares. When a wall is right ahead,
// this square is the last one: that is 1. Otherwise, step on, and it is 1 (this
// square) plus however many the rest counts.
function measureGap(): number {
  if (robot.wallAhead()) return 1;
  next();
  return 1 + measureGap();
}

// Keep the measured number in a name, drop to the row below, and spend it:
// paint that many squares where no wall will stop you.
export function paintFloatingRow(): void {
  const gap = measureGap();
  nextRow();
  paintCells(gap);
}

// RUNG 2 -- measure once, spend it many times.
// Measure the top row once. After the first nextRow there is nothing left to
// feel, so the only way to match is to keep the number.
export function matchRows(): void {
  const gap = measureGap();
  for (let i = 0; i < 3; i += 1) {
    nextRow();
    paintCells(gap);
  }
}

// RUNG 3 -- count on the way along, spend on the way down.
// Paint the square you stand on, then feel. When a wall is right ahead this is
// the last square: that is 1. Otherwise step on and add what the rest counts.
function paintToWall(): number {
  paint();
  if (robot.wallAhead()) return 1;
  next();
  return 1 + paintToWall();
}

// The row below is as long as the row you just painted, and nothing down there
// tells you the number, so you must carry it down from the count.
export function paintAndMatch(): void {
  const len = paintToWall();
  nextRow();
  paintCells(len);
}
