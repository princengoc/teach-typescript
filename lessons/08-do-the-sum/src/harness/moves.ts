import { robot } from './robot';

// The four moves you have been spending, all here ready-made. You spend them;
// you may also open them. Nothing in here is magic -- it is robot calls under a
// name, and this file is the whole of it.

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

// Paints `n` squares in a row, starting on the square the robot stands on and
// going forward. It paints exactly `n` -- no wall stops it, so `n` is the only
// thing that can.
export function paintCells(n: number): void {
  robot.paint();
  for (let i = 1; i < n; i += 1) {
    robot.walk(1);
    robot.paint();
  }
}

// Walks back to the first square of the row, one square at a time, until the
// wall stops it.
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
