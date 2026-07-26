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
// The robot faces a wall an unknown number of squares away. Count the squares
// and give the number back. Read the intro on the right: it counts to a wall
// the same way.
//
// TODO: right now this feels once and always says 1, so the row comes out one
// square long. Make it walk to the wall, counting: when a wall is right ahead
// this square is the last one (that is 1); otherwise step on and add 1 to what
// the rest counts.
function measureGap(): number {
  if (robot.wallAhead()) return 1;
  return 1;
}

// This caller is written for you. It keeps the number in a name, goes down to
// the open build lane, and paints that many squares. Once measureGap is right,
// this rung goes green.
export function paintFloatingRow(): void {
  const gap = measureGap();
  goToBuildLane();
  paintCells(gap);
}

// RUNG 2 -- measure once, spend it many times.
// buildFirstBar paints the first bar and hands back how tall it was. The two
// columns after it have no ceiling to feel, so the only way to match is to keep
// that number and spend it again.
//
// TODO: keep the height buildFirstBar returns in a name, then build two more
// bars to match. Right now it throws the number away and guesses 2.
export function matchBars(): void {
  buildFirstBar();
  toNextBarFoot();
  paintBar(2);
}

// RUNG 3 -- count on the way up, spend on the way down.
// TODO: climb the bar, painting each square and counting, until a wall is right
// ahead (the top). Give the count back. Right now it paints one square and
// stops.
function climbCounting(): number {
  robot.paint();
  return 1;
}

// This caller is written for you. The floor is as long as the bar was tall, and
// nothing on the floor tells you the number: you carry it down from the climb.
// Once climbCounting is right, this rung goes green.
export function climbAndFloor(): void {
  const height = climbCounting();
  goHomeFaceEast();
  paintCells(height);
}
