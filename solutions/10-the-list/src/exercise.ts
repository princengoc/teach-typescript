import { next, nextRow, paint, paintCells } from './harness/moves';
import type { Room } from './harness/types';

// RUNG 1 -- the bar chart. One number out of the list, one bar.
export function paintChart(room: Room): void {
  for (const n of room.bars) {
    paintCells(n);
    nextRow();
  }
}

// RUNG 2 -- the same chart, with the bar built by hand. The inner loop stops at
// the number the outer loop just handed over.
export function paintChartByHand(room: Room): void {
  for (const n of room.bars) {
    for (let i = 0; i < n; i += 1) {
      paint();
      next();
    }
    nextRow();
  }
}

// RUNG 3 -- the rule, and the chart that stays lined up. The if guards the
// paint; nextRow() sits outside it, so every number keeps its row.
function tall(n: number, room: Room): boolean {
  return n >= room.min;
}

export function paintTallBars(room: Room): void {
  for (const n of room.bars) {
    if (tall(n, room)) paintCells(n);
    nextRow();
  }
}
