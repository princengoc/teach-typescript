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

// RUNG 1.
export function paintBox(room: Room): void {
  for (let y = 0; y < room.height; y += 1) {
    for (let x = 0; x < room.width; x += 1) {
      paint();
      next();
    }
    nextRow();
  }
}

// RUNG 2.
export function gap(a: number, b: number): number {
  if (a > b) return a - b;
  return b - a;
}

export function near(x: number, y: number, room: Room): boolean {
  return gap(x, room.midX) + gap(y, room.midY) <= room.reach;
}

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

// RUNG 3.
export function cellNumber(x: number, y: number, room: Room): number {
  return y * room.width + x;
}

export function wanted(x: number, y: number, room: Room): boolean {
  for (const mark of room.marks) {
    if (mark === cellNumber(x, y, room)) return true;
  }
  return false;
}

export function paintPicture(room: Room): void {
  for (let y = 0; y < room.height; y += 1) {
    for (let x = 0; x < room.width; x += 1) {
      if (wanted(x, y, room)) {
        paint();
      }
      next();
    }
    nextRow();
  }
}
