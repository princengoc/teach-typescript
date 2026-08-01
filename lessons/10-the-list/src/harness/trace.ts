import type { Variant } from './task';
import type { World } from './types';
import { step } from './world';

// The intro trace: one beat per number in the list. The same beats run against
// two different lists, so the picture and the ladder cannot disagree.
export interface Beat {
  n: number;
  last: boolean;
}

const TURN_LEFT = { kind: 'turn', hand: 'left' } as const;
const STEP = { kind: 'step' } as const;
const PAINT = { kind: 'paint' } as const;

// One beat per bar: paint a row that long, then drop, except after the last.
export function beats(variant: Variant): Beat[] {
  const out: Beat[] = [];
  let seen = 0;
  for (const n of variant.bars) {
    seen += 1;
    out.push({ n, last: seen === variant.bars.length });
  }
  return out;
}

// What nextRow() does, played out on the trace world: turn around, walk back
// along the row, turn down, step, turn along the new row.
function carriageReturn(world: World): World {
  let out = step(step(world, TURN_LEFT), TURN_LEFT);
  for (let i = 0; i < world.robot.x; i += 1) {
    out = step(out, STEP);
  }
  out = step(out, TURN_LEFT);
  out = step(out, STEP);
  return step(out, TURN_LEFT);
}

export function applyBeat(world: World, beat: Beat): World {
  let out = step(world, PAINT);
  for (let i = 1; i < beat.n; i += 1) {
    out = step(step(out, STEP), PAINT);
  }
  return beat.last ? out : carriageReturn(out);
}

export function beatLine(beat: Beat): string {
  return `n = ${beat.n}`;
}
