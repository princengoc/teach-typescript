import { goToNextBar, paintBar } from './harness/moves';
import { robot } from './harness/robot';

// The room wants a staircase: three bars in a row, each one taller than the
// last. paintBar(h) paints one bar h squares tall. goToNextBar() steps to the
// foot of the next one.
//
// You do not get to see how tall the first bar is; the room decides, and
// robot.startHeight() hands you the number. Each bar after that is one taller.
//
// The first bar is done. Your turn: two more, each one taller. You will need
// to add one to height before each -- and a const cannot change. Fix that
// first, then paint.
export function paintStaircase(): void {
  const height = robot.startHeight();
  paintBar(height);
  goToNextBar();
}
