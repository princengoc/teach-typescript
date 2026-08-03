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

// This lesson the room tells you nothing. There is no room.something to read:
// the number is in the walls, and the only way to it is to feel your way and
// count. Then you hand the count back, and the rest of your code spends it.

// RUNG 1 -- measure, then build.
// The robot stands at the start of the top row, with a wall an unknown number
// of squares away. Count the squares and give the number back. Read the intro
// on the right: it counts to a wall the same way.
//
// TODO: right now this steps once and always says 1, so the row below comes out
// one square long. Make it walk to the wall, counting: when a wall is right
// ahead this square is the last one (that is 1); otherwise step on and add 1 to
// what the rest counts.
function measureGap(): number {
  if (robot.wallAhead()) return 1;
  next();
  return 1;
}

// This caller is written for you. It keeps the number in a name, drops to the
// row below, and paints that many squares. Once measureGap is right, this rung
// goes green.
export function paintFloatingRow(): void {
  const gap = measureGap();
  nextRow();
  paintCells(gap);
}

// RUNG 2 -- measure once, spend it many times.
// Three rows below the top one, all as long as the gap. Only the top row has a
// wall to feel: once you have dropped a row there is nothing left to measure,
// so the number has to be kept and spent again.
//
// TODO: measure the gap once with your own measureGap, keep it in a name, and
// paint three matching rows under it. Right now it drops a row and guesses 2.
export function matchRows(): void {
  nextRow();
  paintCells(2);
}

// RUNG 3 -- count on the way along, spend on the way down.
// TODO: paint the top row square by square, counting as you go, until a wall is
// right ahead. Give the count back. Right now it paints one square, steps, and
// stops.
function paintToWall(): number {
  paint();
  next();
  return 1;
}

// This caller is written for you. The row below is as long as the row you just
// painted, and nothing down there tells you the number: you carry it with you.
// Once paintToWall is right, this rung goes green.
export function paintAndMatch(): void {
  const len = paintToWall();
  nextRow();
  paintCells(len);
}
