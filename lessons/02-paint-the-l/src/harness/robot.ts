import type { Command } from './types';

// The recording facade. The kid calls these; nothing moves yet. Each call
// writes down one command, and the preview replays the list afterwards.
const recorded: Command[] = [];

export const robot = {
  paint(): void {
    recorded.push({ kind: 'paint' });
  },
  step(): void {
    recorded.push({ kind: 'step' });
  },
  turnLeft(): void {
    recorded.push({ kind: 'turn', hand: 'left' });
  },
  turnRight(): void {
    recorded.push({ kind: 'turn', hand: 'right' });
  },
};

export function script(): Command[] {
  return [...recorded];
}
