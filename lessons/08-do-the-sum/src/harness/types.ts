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

// The numbers a room hands the kid's code: the lane length, and the band's two
// ends. The kid reads these fields; the rule computes from them.
export interface Room {
  len: number;
  lo: number;
  hi: number;
}
