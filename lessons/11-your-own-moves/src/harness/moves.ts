import { robot } from './robot';

// This is the whole of what you are handed this lesson. Two moves, and the
// robot underneath them. Read them: a move is nothing but robot calls under a
// name. The moves you have been spending -- paintCells, nextRow -- used to sit
// in this file. They are yours to write now.

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

// The robot itself: robot.turnLeft() turns it a quarter turn to the left, and
// robot.wallAhead() is the sensor from lesson 06.
export { robot };
