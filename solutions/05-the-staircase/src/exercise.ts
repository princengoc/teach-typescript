import { goToNextBar, paintBar } from './harness/moves';
import { robot } from './harness/robot';

// The room wants a staircase: three bars in a row, each one taller than the
// last. paintBar(h) paints one bar h squares tall. goToNextBar() steps to the
// foot of the next one.
//
// You do not get to see how tall the first bar is; the room decides, and
// robot.startHeight() hands you the number. Each bar after that is one taller.
export function paintStaircase(): void {
  let height = robot.startHeight();
  paintBar(height);
  goToNextBar();
  height += 1;
  paintBar(height);
  goToNextBar();
  height += 1;
  paintBar(height);
}
