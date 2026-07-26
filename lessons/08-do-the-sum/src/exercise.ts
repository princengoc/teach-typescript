import { next, paint } from './harness/moves';
import type { Room } from './harness/types';

// This lesson you write the RULE, and the robot follows it at every square. A
// rule is a function that gives back true or false. You loop down the lane, and
// where the rule says true, you paint.

// RUNG 1 -- the back half. The loop is written for you: read it, it is the
// shape you will copy below. Your job is the rule.
//
// TODO: return true for a square in the back half -- one whose index i is at
// least len / 2. Right now it asks for i >= len, which no square reaches, so
// nothing paints. Halve it.
function backHalf(i: number, len: number): boolean {
  return i >= len;
}

export function paintBackHalf(room: Room): void {
  for (let i = 0; i < room.len; i += 1) {
    if (backHalf(i, room.len)) paint();
    next();
  }
}

// RUNG 2 -- stripes. Now you write both the rule and the loop.
//
// TODO: write a rule stripe(i) that returns true for every other square (the
// even ones -- use %), then a loop like the one above that paints where it says
// so. Right now it just walks the lane and paints nothing.
export function paintStripes(room: Room): void {
  for (let i = 0; i < room.len; i += 1) {
    next();
  }
}

// RUNG 3 -- the band. Read the two ends off the room: room.lo and room.hi.
//
// TODO: write a rule band(i) that returns true when i is from lo to hi, ends
// included (i >= lo AND i <= hi -- join two tests with &&), then the loop that
// paints where it says so.
export function paintBand(room: Room): void {
  for (let i = 0; i < room.len; i += 1) {
    next();
  }
}
