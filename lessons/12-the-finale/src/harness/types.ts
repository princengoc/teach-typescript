export type Direction = 'north' | 'east' | 'south' | 'west';

export interface Cell {
  x: number;
  y: number;
}

export interface Robot {
  x: number;
  y: number;
  facing: Direction;
}

export interface World {
  width: number;
  height: number;
  blocked: boolean[][];
  painted: boolean[][];
  robot: Robot;
  crashed: boolean;
}

export type Command =
  | { kind: 'step' }
  | { kind: 'turn'; hand: 'left' | 'right' }
  | { kind: 'paint' };

// What a room hands the kid's code. Every rung walks the same `width` by
// `height` box; they differ only in the rule. Rung 2 reads the middle square
// and how far the diamond reaches from it; rung 3 reads the list of square
// numbers the picture wants painted.
export interface Room {
  // How many squares across the box reaches.
  width: number;
  // How many rows down the box reaches.
  height: number;
  // How far across the middle square is.
  midX: number;
  // How far down the middle square is.
  midY: number;
  // How far from the middle the diamond reaches.
  reach: number;
  // The numbers of the squares the picture wants painted.
  marks: number[];
}
