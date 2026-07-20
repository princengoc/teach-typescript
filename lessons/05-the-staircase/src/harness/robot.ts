import type { Command, World } from './types';
import { step as stepWorld } from './world';

// The live facade. The kid's code asks the robot how tall the first bar is,
// and the answer depends on the room. So the robot acts as it is called,
// against whichever room the harness handed it.
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
  // How tall the first bar of this room's staircase is. Different rooms give
  // different answers, so read it; you cannot guess the number.
  startHeight(): number {
    return current ? current.startHeight : 1;
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
