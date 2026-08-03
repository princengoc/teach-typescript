import { next, paint, robot } from './harness/moves';
import type { Room } from './harness/types';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paint()            paints the square the robot stands on
//   next()             steps forward to the next square
//   robot.paint()      paints the square the robot stands on
//   robot.step()       moves the robot one square forward
//   robot.walk(steps)  walks the robot `steps` squares forward
//   robot.turnLeft()   turns the robot a quarter turn to the left
//   robot.turnRight()  turns the robot a quarter turn to the right
//   robot.wallAhead()  a sensor: true when the next step lands on a wall
//   room.run           how many squares long one run is
//   room.bars          one number per row: how long that row's bar is
//   room.bands         one number per band: how long that band's bar is
//   room.thick         how many rows deep every band goes
// --- end of your kit ---

// RUNG 1.
export function paintCells(n: number): void {
  paint();
  for (let i = 1; i < n; i += 1) {
    next();
    paint();
  }
}

export function paintRun(room: Room): void {
  paintCells(room.run);
}

// RUNG 2.
export function backToRowStart(): void {
  if (robot.wallAhead()) return;
  next();
  backToRowStart();
}

export function nextRow(): void {
  robot.turnLeft();
  robot.turnLeft();
  backToRowStart();
  robot.turnLeft();
  next();
  robot.turnLeft();
}

export function paintChart(room: Room): void {
  for (const n of room.bars) {
    paintCells(n);
    nextRow();
  }
}

// RUNG 3.
export function paintBand(width: number, rows: number): void {
  for (let i = 0; i < rows; i += 1) {
    paintCells(width);
    nextRow();
  }
}

export function paintBands(room: Room): void {
  for (const width of room.bands) {
    paintBand(width, room.thick);
  }
}
