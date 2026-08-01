import { next, nextRow, paint, paintCells } from './harness/moves';
import type { Room } from './harness/types';

// This lesson: a list. `room.bars` is a `number[]` -- many numbers in order,
// under one name. `for...of` hands them to you one at a time, so the data draws
// the picture and you never type a number in.

// RUNG 1 -- the bar chart. One number is one bar: a row that many squares long.
// paintCells(n) paints n squares in a row for you; nextRow() drops to the row
// below.
//
// TODO: right now one number is read off the room and one bar is painted. Swap
// `const n = room.min;` for a loop -- `for (const n of room.bars) {` -- around
// the two lines under it, so every number in the list gets its own bar.
export function paintChart(room: Room): void {
  const n = room.min;
  paintCells(n);
  nextRow();
}

// RUNG 2 -- the same chart, but paintCells has gone home. Below is what it did,
// spelled out: paint the square you stand on, step on, and again, n squares
// over. It is written here for one bar of one fixed length.
//
// TODO: make it draw the whole chart. Wrap it in a loop over room.bars, let each
// bar stop at its own n instead of room.min, and call nextRow() at its foot.
export function paintChartByHand(room: Room): void {
  for (let i = 0; i < room.min; i += 1) {
    paint();
    next();
  }
}

// RUNG 3 -- skip the short bars. A bar counts as tall when it is at least
// room.min long. A short bar is not painted, but its row is still its own: the
// robot drops a row for every number in the list, painted or not.
//
// TODO, two jobs. Write the rule tall(n, room) that hands back true when a bar
// is tall enough, then paint only the bars it says yes to. Right now every bar
// is painted, short ones and all.
export function paintTallBars(room: Room): void {
  for (const n of room.bars) {
    paintCells(n);
    nextRow();
  }
}
