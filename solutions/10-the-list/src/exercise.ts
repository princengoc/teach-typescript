import { next, nextRow, paint } from './harness/moves';
import type { Room } from './harness/types';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paint()    paints the square the robot stands on
//   next()     steps forward to the next square
//   nextRow()  carries the robot to the first square of the row below,...
//   room.bars  one number per row: how long that row's bar is
//   room.min   how long a bar has to be to count as tall
// --- end of your kit ---

// RUNG 1 -- the bar chart. for...of hands you one number at a time, and each
// one is a row that long.
export function paintChart(room: Room): void {
  for (const n of room.bars) {
    for (let i = 0; i < n; i += 1) {
      paint();
      next();
    }
    nextRow();
  }
}

// RUNG 2 -- skip the short bars. The rule reads the mark off the room, and
// nextRow sits outside the if, so every number keeps its own row.
function tall(n: number, room: Room): boolean {
  return n >= room.min;
}

export function paintTallBars(room: Room): void {
  for (const n of room.bars) {
    if (tall(n, room)) {
      for (let i = 0; i < n; i += 1) {
        paint();
        next();
      }
    }
    nextRow();
  }
}

// RUNG 3 -- the tallest bar. Walk the whole list carrying the best answer so
// far, and only take a number when it beats what you are holding.
export function paintTallest(room: Room): void {
  let best = 0;
  for (const n of room.bars) {
    if (n > best) best = n;
  }
  for (let i = 0; i < best; i += 1) {
    paint();
    next();
  }
}
