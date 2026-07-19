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

export interface Task {
  start: World;
  targetPainted: boolean[][];
  goal?: { x: number; y: number };
}
