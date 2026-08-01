import type { Variant } from './task';
import type { World } from './types';
import { step } from './world';

// The intro trace: the nest, played one beat at a time. It walks the same box
// the first rung is graded in, so the picture and the ladder cannot disagree.
export type Beat =
  | { kind: 'row'; y: number }
  | { kind: 'cell'; x: number; last: boolean }
  | { kind: 'wrap' };

const TURN_LEFT = { kind: 'turn', hand: 'left' } as const;
const STEP = { kind: 'step' } as const;
const PAINT = { kind: 'paint' } as const;

// Every beat the trace plays: a row header from the outer loop, one beat per
// square from the inner loop, then the drop to the next row.
export function beats(variant: Variant): Beat[] {
  const out: Beat[] = [];
  for (let y = 0; y < variant.height; y += 1) {
    out.push({ kind: 'row', y });
    for (let x = 0; x < variant.width; x += 1) {
      out.push({ kind: 'cell', x, last: x === variant.width - 1 });
    }
    if (y < variant.height - 1) out.push({ kind: 'wrap' });
  }
  return out;
}

// What nextRow() does, played out on the trace world: turn around, walk back
// along the row, turn down, step, turn along the new row.
function carriageReturn(world: World): World {
  let out = step(step(world, TURN_LEFT), TURN_LEFT);
  for (let i = 0; i < world.width - 1; i += 1) {
    out = step(out, STEP);
  }
  out = step(out, TURN_LEFT);
  out = step(out, STEP);
  return step(out, TURN_LEFT);
}

export function applyBeat(world: World, beat: Beat): World {
  if (beat.kind === 'cell') {
    const painted = step(world, PAINT);
    return beat.last ? painted : step(painted, STEP);
  }
  if (beat.kind === 'wrap') return carriageReturn(world);
  return world;
}

export function beatLine(beat: Beat): string {
  if (beat.kind === 'row') return `row y = ${beat.y}`;
  if (beat.kind === 'cell') return `    x = ${beat.x}  ->  paint`;
  return '    row done  ->  nextRow()';
}
