import { nextRow, paintCells } from './harness/moves';
import { robot } from './harness/robot';
import type { Room } from './harness/types';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paintCells(n)      paints `n` squares in a row, starting on the square...
//   nextRow()          carries the robot to the first square of the row...
//   robot.paint()      paints the square the robot stands on
//   robot.step()       moves the robot one square forward
//   robot.walk(steps)  walks the robot `steps` squares forward
//   robot.turnLeft()   turns the robot a quarter turn to the left
//   robot.turnRight()  turns the robot a quarter turn to the right
//   robot.wallAhead()  a sensor: true when the next step lands on a wall
//   room.side          how long one side of this room's square is
//   room.width         how many squares across the box reaches
//   room.height        how many rows down the box reaches
//   room.len           how many squares long the first row is
// --- end of your kit ---

export function paintSquare(room: Room): void {
  for (let i = 0; i < 4; i += 1) {
    paintCells(room.side);
    robot.turnRight();
  }
}

export function paintRectangle(room: Room): void {
  for (let i = 0; i < 2; i += 1) {
    paintCells(room.width);
    robot.turnRight();
    paintCells(room.height);
    robot.turnRight();
  }
}

export function paintStaircaseLoop(room: Room): void {
  let len = room.len;
  for (let i = 0; i < room.height; i += 1) {
    paintCells(len);
    nextRow();
    len += 1;
  }
}

function stairsFrom(len: number, rowsLeft: number): void {
  if (rowsLeft === 0) return;
  paintCells(len);
  nextRow();
  stairsFrom(len + 1, rowsLeft - 1);
}

export function paintStaircaseRec(room: Room): void {
  stairsFrom(room.len, room.height);
}

function paintLine(): void {
  robot.paint();
  if (robot.wallAhead()) return;
  robot.walk(1);
  paintLine();
}

export function paintSquareBlind(): void {
  for (let i = 0; i < 4; i += 1) {
    paintLine();
    robot.turnRight();
  }
}
