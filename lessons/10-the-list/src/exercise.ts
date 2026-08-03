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

// This lesson: a list. `room.bars` is a `number[]` -- many numbers in order,
// under one name. `for...of` hands them to you one at a time, so the data draws
// the picture and you never type a number in.
//
// Painting a whole row is not a move this lesson. You write that loop out, and
// you will write it three times: paint the square, step on, n squares over.
// Notice how it feels. Lesson 11 is where you fold it back up into a move.

// RUNG 1 -- the bar chart. One number is one bar: a row that many squares long.
// Below is one bar, painted for one fixed length.
//
// TODO: make it draw the whole chart. Wrap it in a loop over the list --
// `for (const n of room.bars) {` -- let each bar stop at its own n instead of
// room.min, and call nextRow() at its foot so the next bar gets its own row.
export function paintChart(room: Room): void {
  for (let i = 0; i < room.min; i += 1) {
    paint();
    next();
  }
}

// RUNG 2 -- skip the short bars. A bar counts as tall when it is at least
// room.min long. A short bar is not painted, but its row is still its own: the
// robot drops a row for every number in the list, painted or not.
//
// TODO, two jobs. Write the rule tall(n, room) that hands back true when a bar
// is tall enough, then paint only the bars it says yes to. Right now every bar
// is painted, short ones and all.
export function paintTallBars(room: Room): void {
  for (const n of room.bars) {
    for (let i = 0; i < n; i += 1) {
      paint();
      next();
    }
    nextRow();
  }
}

// RUNG 3 -- the tallest bar. One row this time, as long as the longest number
// in the list. The list can be any length and the longest can be anywhere in
// it, so you have to walk the whole list carrying the best answer so far.
//
// TODO: best keeps whatever number came last, not the biggest. Only take n when
// it beats what you are already holding.
export function paintTallest(room: Room): void {
  let best = 0;
  for (const n of room.bars) {
    best = n;
  }
  for (let i = 0; i < best; i += 1) {
    paint();
    next();
  }
}
