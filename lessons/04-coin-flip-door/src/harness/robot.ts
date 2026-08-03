import type { Command, World } from './types';
import { step as stepWorld, wallOnLeft } from './world';

// The live facade. Lesson 03 recorded the calls and replayed them afterwards;
// that cannot work now, because the kid's code asks the robot what it can see
// and the answer depends on the room. So the robot moves as it is called, in
// whichever room the harness handed it.
let current: World | null = null;
let recorded: Command[] = [];

function apply(command: Command): void {
  if (!current) return;
  recorded.push(command);
  current = stepWorld(current, command);
}

export const robot = {
  // Paints the square the robot stands on.
  paint(): void {
    apply({ kind: 'paint' });
  },
  // Moves the robot one square forward.
  step(): void {
    apply({ kind: 'step' });
  },
  // Walks the robot `steps` squares forward.
  walk(steps: number): void {
    for (let i = 0; i < steps; i += 1) {
      apply({ kind: 'step' });
    }
  },
  // Turns the robot a quarter turn to the left.
  turnLeft(): void {
    apply({ kind: 'turn', hand: 'left' });
  },
  // Turns the robot a quarter turn to the right.
  turnRight(): void {
    apply({ kind: 'turn', hand: 'right' });
  },
  // A sensor: true when the square on the robot's left is a wall.
  wallOnLeft(): boolean {
    return current ? wallOnLeft(current) : false;
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
