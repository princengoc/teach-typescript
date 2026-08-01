import { robot } from './robot';

// Three moves handed to you ready-made. You spend them inside your loops: paint
// a square, step along the row, drop to the row below.

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

// Walks back to the first square of the row, feeling for the wall. Nothing new:
// this is lesson 06's recursion, and the wall is its base case.
function backToRowStart(): void {
  if (robot.wallAhead()) return;
  robot.walk(1);
  backToRowStart();
}

// Carries the robot to the first square of the row below, facing along it. It
// is turns and steps you have spent since lesson 02, under one name. On the
// bottom row there is no row below, so it stays where it is.
export function nextRow(): void {
  robot.turnLeft();
  robot.turnLeft();
  backToRowStart();
  robot.turnLeft();
  next();
  robot.turnLeft();
}
