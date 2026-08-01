import { robot } from './robot';

// Four moves handed to you ready-made. You spend them: paint a square, step
// along the row, paint a whole bar, drop to the row below.

// Paints the square the robot stands on.
export function paint(): void {
  robot.paint();
}

// Steps forward to the next square. At the end of a row a wall is ahead, so
// this stops instead of walking off: the last step is safe to call.
export function next(): void {
  if (!robot.wallAhead()) {
    robot.walk(1);
  }
}

// Lesson 07's move, back again. Paints n squares in a row, starting on the
// square the robot stands on and going forward.
export function paintCells(n: number): void {
  paint();
  for (let i = 1; i < n; i += 1) {
    next();
    paint();
  }
}

// Walks back to the first square of the row, feeling for the wall. Nothing new:
// this is lesson 06's recursion, and the wall is its base case.
function backToRowStart(): void {
  if (robot.wallAhead()) return;
  robot.walk(1);
  backToRowStart();
}

// Lesson 09's move. Carries the robot to the first square of the row below,
// facing along it. On the bottom row there is no row below, so it stays put.
export function nextRow(): void {
  robot.turnLeft();
  robot.turnLeft();
  backToRowStart();
  robot.turnLeft();
  next();
  robot.turnLeft();
}
