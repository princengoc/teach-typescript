import type { Command } from './types';

// The recording facade. The kid calls these; nothing moves yet. Each call
// writes down one command, and the preview replays the list afterwards.
const recorded: Command[] = [];

export const robot = {
  // Paints the square the robot stands on.
  paint(): void {
    recorded.push({ kind: 'paint' });
  },
  // Moves the robot one square forward.
  step(): void {
    recorded.push({ kind: 'step' });
  },
  // Turns the robot a quarter turn to the left.
  turnLeft(): void {
    recorded.push({ kind: 'turn', hand: 'left' });
  },
  // Turns the robot a quarter turn to the right.
  turnRight(): void {
    recorded.push({ kind: 'turn', hand: 'right' });
  },
};

export function script(): Command[] {
  return [...recorded];
}
