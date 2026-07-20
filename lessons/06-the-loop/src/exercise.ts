import { paintBar, paintSide, stepToNextBar } from './harness/moves';
import { robot } from './harness/robot';

// Your moves, ready to spend inside loops:
//   paintSide(len)     paints one side, len long, and turns for the next.
//   paintBar(height)   paints one bar, height tall.
//   stepToNextBar()    moves to the foot of the next bar.
// The room's numbers: robot.squareSide(), robot.rectWidth(),
//   robot.rectHeight(), robot.barCount().
//
// The intro slide (preview, on the right) has a worked for loop and a worked
// recursion. Copy the shape, not the numbers. Each rung below paints one thing
// once. Turn it into the whole figure.

// RUNG 1 -- a square: paintSide four times, each side robot.squareSide() long.
export function paintSquare(): void {
  paintSide(robot.squareSide());
}

// RUNG 2 -- a rectangle: a long side then a short one, twice round.
export function paintRectangle(): void {
  paintSide(robot.rectWidth());
}

// RUNG 3 -- the staircase, with a for loop. robot.barCount() bars, each taller.
export function paintStaircaseLoop(): void {
  paintBar(1);
  stepToNextBar();
}

// RUNG 4 -- the same staircase, with recursion: one bar, then climb the rest.
// Write a helper that calls itself, and stop it when no bars are left.
export function paintStaircaseRec(): void {
  paintBar(1);
}
