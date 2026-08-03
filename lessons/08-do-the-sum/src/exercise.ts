import { next, nextRow, paint, paintCells } from './harness/moves';
import type { Room } from './harness/types';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paint()        paints the square the robot stands on
//   next()         steps forward to the next square
//   paintCells(n)  paints `n` squares in a row, starting on the square the...
//   nextRow()      carries the robot to the first square of the row below,...
//   room.width     how many squares across the box reaches
//   room.height    how many rows down the box reaches
//   room.lo        the first row of the band
//   room.hi        the last row of the band
// --- end of your kit ---

// This lesson you write the RULE, and the robot follows it at every square. A
// rule is a function that gives back true or false. You loop along, and where
// the rule says true, you paint.
//
// Nothing else here is new. The loop is lesson 6's, the moves are lesson 7's,
// and by the third rung the rule is asked about a whole row.
//
// Each rule is marked twice: in the picture, and on its own. The panel asks
// your rule about every square of every room, so painting the right pattern
// some other way is not writing the rule.

// RUNG 1 -- the back half. The loop is written for you: read it, it is the
// shape you will copy below. Your job is the rule.
//
// TODO: return true for a square in the back half -- one whose index i is at
// least width / 2. Right now it asks for i >= width, which no square reaches,
// so nothing paints. Halve it.
export function backHalf(i: number, width: number): boolean {
  return i >= width;
}

export function paintBackHalf(room: Room): void {
  for (let i = 0; i < room.width; i += 1) {
    if (backHalf(i, room.width)) paint();
    next();
  }
}

// RUNG 2 -- stripes. Now you write both the rule and the loop.
//
// TODO 1: stripe says yes to every other square -- the even ones. Right now it
// only says yes to the very first one. Use %: an even number is one that
// leaves 0 when you divide it by 2.
export function stripe(i: number): boolean {
  return i === 0;
}

// TODO 2: write the loop. It is the one above, with your rule in it: walk the
// lane, and paint where stripe says so. Right now it walks and paints nothing.
export function paintStripes(room: Room): void {
  for (let i = 0; i < room.width; i += 1) {
    next();
  }
}

// RUNG 3 -- the band of rows. The room is a box now, not one lane, and the rule
// is asked about a whole row instead of one square: rows room.lo to room.hi are
// painted right across, the rest are left alone.
//
// Two moves come back for this. paintCells(n) paints n squares in a row, and
// nextRow() drops to the row below. You have had both since lesson 5.
//
// TODO 1: bandRow says yes to a row from lo to hi, ends included. It has half
// the answer -- it says yes to everything from lo down. Join the other half
// with &&: the row must also be at or before hi. && is true only when both
// sides are.
export function bandRow(y: number, room: Room): boolean {
  return y >= room.lo;
}

// TODO 2: write the loop. Ask bandRow before you paint, and paint the whole row
// across when it says yes. Every row still drops, painted or not, so the box
// keeps its shape. Right now every row is painted, band or not.
export function paintBandRows(room: Room): void {
  for (let y = 0; y < room.height; y += 1) {
    paintCells(room.width);
    nextRow();
  }
}
