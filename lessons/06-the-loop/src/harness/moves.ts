import { robot } from './robot';

// Two moves from lesson 05, handed to you ready-made. You spend them; you may
// also open them. Nothing in here is magic -- it is robot calls under a name,
// and every line of it is a call you have made yourself since lesson 02.

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
  if (!robot.wallAhead()) robot.walk(1);
  robot.turnLeft();
}
