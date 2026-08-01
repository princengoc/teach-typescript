import type { Variant } from './task';
import { startWorld } from './task';
import type { Command, World } from './types';
import { step, wallAhead } from './world';

// The intro trace: the named moves on the left, the robot calls they unfold
// into on the right. Four names, twenty-odd calls, one picture. The beats are
// built by walking the room, so a wall stops a step here exactly as it would
// stop the kid's code.
export interface Beat {
  move: string;
  call: string;
  command?: Command;
}

const TURN_LEFT: Command = { kind: 'turn', hand: 'left' };
const STEP: Command = { kind: 'step' };
const PAINT: Command = { kind: 'paint' };

interface Build {
  world: World;
  beats: Beat[];
}

function push(
  build: Build,
  move: string,
  call: string,
  command: Command,
): void {
  build.beats.push({ move, call, command });
  build.world = step(build.world, command);
}

// next(): the step is skipped when a wall is ahead, and the trace says so.
function traceNext(build: Build, move: string): void {
  if (wallAhead(build.world)) {
    build.beats.push({ move, call: 'wall ahead, so no step' });
    return;
  }
  push(build, move, 'robot.walk(1)', STEP);
}

function tracePaintCells(build: Build, n: number): void {
  const move = `paintCells(${n})`;
  push(build, move, 'robot.paint()', PAINT);
  for (let i = 1; i < n; i += 1) {
    traceNext(build, move);
    push(build, move, 'robot.paint()', PAINT);
  }
}

function traceNextRow(build: Build): void {
  const move = 'nextRow()';
  push(build, move, 'robot.turnLeft()', TURN_LEFT);
  push(build, move, 'robot.turnLeft()', TURN_LEFT);
  while (!wallAhead(build.world)) {
    push(build, move, 'robot.walk(1)', STEP);
  }
  push(build, move, 'robot.turnLeft()', TURN_LEFT);
  traceNext(build, move);
  push(build, move, 'robot.turnLeft()', TURN_LEFT);
}

// The rung 2 loop, unfolded: one bar, one drop, until the list runs out.
export function beats(variant: Variant): Beat[] {
  const build: Build = { world: startWorld(variant), beats: [] };
  for (const n of variant.room.bars) {
    tracePaintCells(build, n);
    traceNextRow(build);
  }
  return build.beats;
}

export function applyBeat(world: World, beat: Beat): World {
  return beat.command ? step(world, beat.command) : world;
}

// How many named lines the kid writes for that many robot calls.
export function moveNames(list: Beat[]): string[] {
  const names: string[] = [];
  for (const beat of list) {
    if (names[names.length - 1] !== beat.move) names.push(beat.move);
  }
  return names;
}
