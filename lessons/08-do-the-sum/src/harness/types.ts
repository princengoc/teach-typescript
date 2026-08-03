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

// The numbers a room hands the kid's code: how far the box reaches, and the
// band's two ends. The kid reads these fields; the rule computes from them.
export interface Room {
  // How many squares across the box reaches.
  width: number;
  // How many rows down the box reaches.
  height: number;
  // The first row of the band.
  lo: number;
  // The last row of the band.
  hi: number;
}
