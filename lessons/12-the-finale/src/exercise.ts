import { next, nextRow, paint } from './harness/moves';
import type { Room } from './harness/types';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   paint()      paints the square the robot stands on
//   next()       steps forward to the next square
//   nextRow()    carries the robot to the first square of the row below,...
//   room.width   how many squares across the box reaches
//   room.height  how many rows down the box reaches
//   room.midX    how far across the middle square is
//   room.midY    how far down the middle square is
//   room.reach   how far from the middle the diamond reaches
//   room.marks   the numbers of the squares the picture wants painted
// --- end of your kit ---

// The finale. Nothing here is new. One walk goes over every square of the box,
// asks a rule about the square it is standing on, and paints the ones the rule
// says yes to. Change the rule, get a different picture. That is the whole of
// it, and by the end of this file you write the walk and the rule yourself.

// RUNG 1 -- the walk, with no rule at all: paint every square of a box that is
// room.width across and room.height down.
//
// TODO: right now the first square of every row is painted. The outer loop is
// here; the row is not. A row is paint-and-step, room.width squares of it.
// Write the loop that goes across, inside the one that goes down.
export function paintBox(room: Room): void {
  for (let y = 0; y < room.height; y += 1) {
    paint();
    nextRow();
  }
}

// RUNG 2 -- a rule made out of arithmetic. The room names its middle square,
// room.midX and room.midY, and how far a picture reaches from it, room.reach.
// A square belongs to the diamond when how far across it is, plus how far down
// it is, is no more than the reach.
//
// TODO 1: gap says how far apart two numbers are, whichever way round they
// come. Right now gap(2, 5) hands back -3, and a distance is never below zero.
export function gap(a: number, b: number): number {
  return a - b;
}

// TODO 2: near is the rule. It has the shape right -- how far across, plus how
// far down -- but y is not how far down: y is where the square is. How far down
// is the gap between y and the middle.
export function near(x: number, y: number, room: Room): boolean {
  return gap(x, room.midX) + y <= room.reach;
}

// The walk is written for you this time. It is the one you wrote in rung 1,
// with a rule in it. Read it: every square is asked about, and only the yeses
// are painted. Nothing here changes.
export function paintDiamond(room: Room): void {
  for (let y = 0; y < room.height; y += 1) {
    for (let x = 0; x < room.width; x += 1) {
      if (near(x, y, room)) {
        paint();
      }
      next();
    }
    nextRow();
  }
}

// RUNG 3 -- a rule made out of data, and then the whole thing. Number the
// squares the way you read a book: 0 at the top left, along the row, then on to
// the row below. room.marks is the list of numbers the picture wants painted.
//
// TODO 1: cellNumber gives a square its number. A whole row is room.width
// squares long, so getting past y rows takes that many squares y times over.
// One of the signs below is the wrong one.
export function cellNumber(x: number, y: number, room: Room): number {
  return y + room.width + x;
}

// TODO 2: wanted is the rule. It says yes when this square's number is one of
// the numbers on room.marks. Walk the list with for...of and hand back true the
// moment you find it; if the list runs out, the answer is no. Right now it only
// ever says yes to square 0.
export function wanted(x: number, y: number, room: Room): boolean {
  return cellNumber(x, y, room) === 0;
}

// TODO 3: the picture. No walk is handed to you this time. Write it: go over
// every square of the box, ask wanted about the one you are standing on, paint
// it when the answer is yes, step on either way, and drop a row at the end of
// each. Right now the whole box is painted, wanted squares and all the rest.
export function paintPicture(room: Room): void {
  paintBox(room);
}
