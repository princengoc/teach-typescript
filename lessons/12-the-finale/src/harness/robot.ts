import type { Command, World } from './types';
import { wallAhead as senseWallAhead, step as stepWorld } from './world';

// The live facade. The kid's code walks the robot and feels for walls, and the
// answers depend on the room. So the robot acts as it is called, against
// whichever room the harness handed it.
let current: World | null = null;
let recorded: Command[] = [];

// A recursion with the base case missing never stops on its own. The cap stops
// it, and the judge says so instead of the preview going white.
const COMMAND_CAP = 2000;

function apply(command: Command): void {
  if (!current) return;
  if (recorded.length >= COMMAND_CAP) throw new Error('runaway program');
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
  // A sensor, not a number: true when the next step lands on a wall. There is
  // no number to read this lesson. You feel the wall, and count the steps.
  wallAhead(): boolean {
    return current ? senseWallAhead(current) : true;
  },
};

export interface Run {
  world: World;
  commands: Command[];
  stopped: boolean;
}

// Runs the kid's program against one room and hands back what happened. The
// program is a function, not a script, so the same code can be spent on as
// many rooms as the judge wants. `stopped` is true when the program ran away
// and the harness had to cut it off.
export function runProgram(start: World, program: () => void): Run {
  current = start;
  recorded = [];
  let stopped = false;
  try {
    program();
  } catch {
    stopped = true;
  }
  const world = current ?? start;
  current = null;
  return { world, commands: [...recorded], stopped };
}
