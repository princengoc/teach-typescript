import { next, paint, robot } from './harness/moves';
import type { Room } from './harness/types';

// RUNG 1.
export function paintCells(n: number): void {
  paint();
  for (let i = 1; i < n; i += 1) {
    next();
    paint();
  }
}

export function paintRun(room: Room): void {
  paintCells(room.n);
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
