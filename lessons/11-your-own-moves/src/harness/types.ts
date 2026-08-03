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

// What a room hands the kid's code. Each rung reads its own part: `run` is the
// length of one run, `bars` is a chart, and `bands` with `thick` is a chart
// whose every bar is `thick` rows deep.
export interface Room {
  // How many squares long one run is.
  run: number;
  // One number per row: how long that row's bar is.
  bars: number[];
  // One number per band: how long that band's bar is.
  bands: number[];
  // How many rows deep every band goes.
  thick: number;
}
