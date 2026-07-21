import type { Command, World } from './types';
import { wallAhead as senseWallAhead, step as stepWorld } from './world';

// The live facade. The kid's code asks the robot for the room's numbers, and
// the answers depend on the room. So the robot acts as it is called, against
// whichever room the harness handed it.
let current: World | null = null;
let recorded: Command[] = [];

function apply(command: Command): void {
  if (!current) return;
  recorded.push(command);
  current = stepWorld(current, command);
}

export const robot = {
  paint(): void {
    apply({ kind: 'paint' });
  },
  walk(steps: number): void {
    for (let i = 0; i < steps; i += 1) {
      apply({ kind: 'step' });
    }
  },
  turnLeft(): void {
    apply({ kind: 'turn', hand: 'left' });
  },
  turnRight(): void {
    apply({ kind: 'turn', hand: 'right' });
  },
  // The numbers the room decides. Read them; you cannot guess. Each rung reads
  // the one it needs.
  squareSide(): number {
    return current ? current.dims.squareSide : 0;
  },
  rectWidth(): number {
    return current ? current.dims.rectWidth : 0;
  },
  rectHeight(): number {
    return current ? current.dims.rectHeight : 0;
  },
  barCount(): number {
    return current ? current.dims.barCount : 0;
  },
  // A sensor, not a number: true when the next step lands on a wall. The blind
  // square never learns its side; it feels for the wall instead.
  wallAhead(): boolean {
    return current ? senseWallAhead(current) : true;
  },
};

export interface Run {
  world: World;
  commands: Command[];
}

// Runs the kid's program against one room and hands back what happened. The
// program is a function, not a script, so the same code can be spent on as
// many rooms as the judge wants.
export function runProgram(start: World, program: () => void): Run {
  current = start;
  recorded = [];
  program();
  const world = current;
  current = null;
  return { world, commands: [...recorded] };
}
