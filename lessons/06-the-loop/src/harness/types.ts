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

// The numbers the room decides and the robot's sensors read back. One rung
// reads one of them; the rest sit at zero for that rung.
export interface Dims {
  squareSide: number;
  rectWidth: number;
  rectHeight: number;
  barCount: number;
}

export interface World {
  width: number;
  height: number;
  blocked: boolean[][];
  painted: boolean[][];
  robot: Robot;
  crashed: boolean;
  dims: Dims;
}

export type Command =
  | { kind: 'step' }
  | { kind: 'turn'; hand: 'left' | 'right' }
  | { kind: 'paint' };

export interface Task {
  start: World;
  targetPainted: boolean[][];
  goal?: { x: number; y: number };
}
