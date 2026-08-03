import { robot } from './robot';

// Your kit. Nothing in here is new: paint() and next() are the two you have
// always had, and nextRow() is the move you wrote in lesson 11, handed back to
// you word for word. Read it if you like. Then spend it.

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

// Your lesson 11 move: walk back along the row until the wall stops you.
function backToRowStart(): void {
  if (robot.wallAhead()) return;
  next();
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

export { robot };
