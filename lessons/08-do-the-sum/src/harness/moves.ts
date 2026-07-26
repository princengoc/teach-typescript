import { robot } from './robot';

// Two moves handed to you ready-made. You spend them inside your loop: decide
// with your rule, paint when it says yes, then step to the next square.

// Paints the square the robot stands on.
export function paint(): void {
  robot.paint();
}

// Steps forward to the next square. At the end of the lane a wall is ahead, so
// this stops instead of walking off: the last step is safe to call.
export function next(): void {
  if (!robot.wallAhead()) {
    robot.walk(1);
  }
}
