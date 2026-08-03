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

// The numbers a room hands the kid's code. One rung reads one or two of them;
// the rest sit at zero for that rung, and the blind square reads none at all.
export interface Room {
  // How long one side of this room's square is.
  side: number;
  // How many squares across the box reaches.
  width: number;
  // How many rows down the box reaches.
  height: number;
  // How many squares long the first row is.
  len: number;
}
