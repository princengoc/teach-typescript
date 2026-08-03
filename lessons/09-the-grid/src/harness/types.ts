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

// The numbers a room hands the kid's code: how far the box reaches across, and
// how far it reaches down. Two loops read these, one each.
export interface Room {
  // How many squares across the box reaches.
  width: number;
  // How many rows down the box reaches.
  height: number;
}
