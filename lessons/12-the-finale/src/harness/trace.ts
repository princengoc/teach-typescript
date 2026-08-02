import type { Variant } from './task';
import { cellNumberOf, startWorld, wantedOf } from './task';
import type { Command, World } from './types';
import { step, wallAhead } from './world';

// The intro trace: one walk over a whole box, a square at a time. The left
// column is the rule's answer about the square the robot stands on; the right
// column is what the robot did about it. The beats are built by walking the
// room, so a wall stops a step here exactly as it would stop the kid's code.
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

// The walk, unfolded: ask the rule about every square of the box, paint the
// ones it says yes to, and drop a row at the end of each.
export function beats(variant: Variant): Beat[] {
  const room = variant.room;
  const build: Build = { world: startWorld(variant), beats: [] };
  for (let y = 0; y < room.height; y += 1) {
    for (let x = 0; x < room.width; x += 1) {
      const yes = wantedOf(x, y, room);
      const move = `square ${cellNumberOf(x, y, room)}: ${yes ? 'yes' : 'no'}`;
      if (yes) push(build, move, 'robot.paint()', PAINT);
      traceNext(build, move);
    }
    traceNextRow(build);
  }
  return build.beats;
}

export function applyBeat(world: World, beat: Beat): World {
  return beat.command ? step(world, beat.command) : world;
}

// How many squares the rule was asked about, for the count under the intro.
export function squaresAsked(list: Beat[]): number {
  return moveNames(list).filter((name) => name.startsWith('square ')).length;
}

// The left column only speaks when the answer changes.
export function moveNames(list: Beat[]): string[] {
  const names: string[] = [];
  for (const beat of list) {
    if (names[names.length - 1] !== beat.move) names.push(beat.move);
  }
  return names;
}
