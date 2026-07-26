import { robot } from './robot';

// Moves handed to you ready-made. You do not open them; you spend them. Some
// take a number: that number is the one you measured and kept.

// Walks forward until the wall is right ahead. The glue that carries the robot
// from one lane to the next feels its way, so it never needs the number.
function walkToWall(): void {
  while (!robot.wallAhead()) {
    robot.walk(1);
  }
}

// Paints `n` squares in a row, starting on the square the robot stands on and
// going forward. It paints exactly `n` -- no wall stops it, so `n` is the only
// thing that can.
export function paintCells(n: number): void {
  robot.paint();
  for (let i = 1; i < n; i += 1) {
    robot.walk(1);
    robot.paint();
  }
}

// RUNG 1. After you have measured the gap, this carries the robot down to the
// open build lane at the bottom-left, facing along it, ready to paint.
export function goToBuildLane(): void {
  robot.turnLeft();
  robot.turnLeft();
  walkToWall();
  robot.turnLeft();
  walkToWall();
  robot.turnLeft();
}

// RUNG 2. Paints the first bar for you, climbing until it feels the ceiling,
// and hands back how tall it was. Spend that number on the bars that follow.
export function buildFirstBar(): number {
  robot.paint();
  if (robot.wallAhead()) return 1;
  robot.walk(1);
  return 1 + buildFirstBar();
}

// RUNG 2. Carries the robot down to the foot of the next column, facing up,
// ready for another bar. Works from the top of a bar or from a foot alike.
export function toNextBarFoot(): void {
  robot.turnLeft();
  robot.turnLeft();
  walkToWall();
  robot.turnLeft();
  robot.walk(1);
  robot.turnLeft();
}

// RUNG 2. Paints one bar, `height` squares tall, from the square the robot
// stands on and going up. It leaves the robot back at the foot, facing up.
export function paintBar(height: number): void {
  robot.paint();
  for (let i = 1; i < height; i += 1) {
    robot.walk(1);
    robot.paint();
  }
  robot.turnLeft();
  robot.turnLeft();
  robot.walk(height - 1);
  robot.turnLeft();
  robot.turnLeft();
}

// RUNG 3. After you have climbed and counted, this carries the robot back down
// to the foot and turns it along the floor, ready to paint the floor row.
export function goHomeFaceEast(): void {
  robot.turnLeft();
  robot.turnLeft();
  walkToWall();
  robot.turnLeft();
}
