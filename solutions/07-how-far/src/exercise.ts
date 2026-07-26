import {
  buildFirstBar,
  goHomeFaceEast,
  goToBuildLane,
  paintBar,
  paintCells,
  toNextBarFoot,
} from './harness/moves';
import { robot } from './harness/robot';

// RUNG 1 -- measure, then build.
// Feel your way to the wall, counting the squares. When a wall is right ahead,
// this square is the last one: that is 1. Otherwise, step on, and it is 1 (this
// square) plus however many the rest counts.
function measureGap(): number {
  if (robot.wallAhead()) return 1;
  robot.walk(1);
  return 1 + measureGap();
}

// Keep the measured number in a name, go down to the open build lane, and spend
// the number: paint that many squares where no wall will stop you.
export function paintFloatingRow(): void {
  const gap = measureGap();
  goToBuildLane();
  paintCells(gap);
}

// RUNG 2 -- measure once, spend it many times.
// buildFirstBar paints the first bar and hands back how tall it was. Keep that
// height and build two more bars to match, where there is no ceiling to feel.
export function matchBars(): void {
  const height = buildFirstBar();
  for (let i = 0; i < 2; i += 1) {
    toNextBarFoot();
    paintBar(height);
  }
}

// RUNG 3 -- count on the way up, spend on the way down.
// Climb the bar, painting as you go, and count the squares. When a wall is
// right ahead, this is the top: that is 1.
function climbCounting(): number {
  robot.paint();
  if (robot.wallAhead()) return 1;
  robot.walk(1);
  return 1 + climbCounting();
}

// The floor is as long as the bar was tall. Nothing on the floor tells you the
// number, so you must carry it down from the climb.
export function climbAndFloor(): void {
  const height = climbCounting();
  goHomeFaceEast();
  paintCells(height);
}
