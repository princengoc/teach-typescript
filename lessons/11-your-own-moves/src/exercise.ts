import { next, paint, robot } from './harness/moves';
import type { Room } from './harness/types';

// This lesson: your own moves. paintCells and nextRow, the moves you have been
// spending for four lessons, were robot calls under a name -- someone else's
// name. Open src/harness/moves.ts and see what is left: paint() is one robot
// call, next() is two lines. Nothing in there is magic. Today you write the
// moves, and the pictures you drew before have to come out the same.

// RUNG 1 -- paintCells. It paints n squares in a row, starting on the square
// the robot stands on and going forward. The lane is wider than n, so no wall
// stops you at the right place: n is the only thing that can.
//
// TODO: right now one square is painted and one step is taken. A run of n
// squares is that step-and-paint pair again and again, until n squares carry
// paint. Write it.
export function paintCells(n: number): void {
  paint();
  if (n > 1) next();
}

// The call is written for you. Nothing here changes.
export function paintRun(room: Room): void {
  paintCells(room.n);
}

// RUNG 2 -- nextRow, and the move it is built from. nextRow carries the robot
// to the first square of the row below, facing along it, ready for the next
// bar. Two jobs.
//
// TODO 1: backToRowStart walks the robot back along the row it is on until the
// wall stops it. Nothing new -- this is lesson 06's recursion, and the wall is
// its base case. Right now it takes one step and gives up.
export function backToRowStart(): void {
  if (robot.wallAhead()) return;
  next();
}

// TODO 2: nextRow. It starts by turning around, two quarter turns to the left,
// so the robot faces back along the row it just painted. That much is here.
// Four calls are missing after it: walk back to the start of the row, turn to
// face the row below, step down onto it, turn to face along it.
export function nextRow(): void {
  robot.turnLeft();
  robot.turnLeft();
}

// The chart loop is written for you: one number, one bar, then drop a row. It
// draws nothing until both moves above are right.
export function paintChart(room: Room): void {
  for (const n of room.bars) {
    paintCells(n);
    nextRow();
  }
}

// RUNG 3 -- the same chart, thicker. Every bar is room.thick rows deep instead
// of one. paintBands below draws it, and it is a mess: two lines copied three
// times, so it paints three-row bands and nothing else. These rooms are two and
// four rows deep.
//
// TODO 1: paintBand paints one band -- rows rows, each width squares long. The
// shape below is right and the two numbers are the wrong way round, so it paints
// a band as deep as the bars are long.
export function paintBand(width: number, rows: number): void {
  for (let i = 0; i < width; i += 1) {
    paintCells(rows);
    nextRow();
  }
}

// TODO 2: cut paintBands down. One band is one call to paintBand, so the loop
// below has one line in it, not six, and the room decides how deep a band goes.
export function paintBands(room: Room): void {
  for (const width of room.bands) {
    paintCells(width);
    nextRow();
    paintCells(width);
    nextRow();
    paintCells(width);
    nextRow();
  }
}
