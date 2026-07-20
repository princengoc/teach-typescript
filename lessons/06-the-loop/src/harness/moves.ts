import { robot } from './robot';

// Moves from earlier lessons, handed to you ready-made. You do not open them;
// you spend them inside your loops.

// Paints one side of a shape, `len` squares long, starting from the square the
// robot stands on and going forward. It ends turned right, at the foot of the
// next side, so the same move paints the side after it.
export function paintSide(len: number): void {
  robot.paint();
  for (let i = 1; i < len; i += 1) {
    robot.walk(1);
    robot.paint();
  }
  robot.turnRight();
}

// Paints one bar, `height` squares tall, from the square the robot stands on
// and going up. It leaves the robot back where it began, facing the same way,
// so the next move starts from a known spot.
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

// Moves the robot to the foot of the next bar, one column to the right, facing
// up again, ready for another paintBar.
export function stepToNextBar(): void {
  robot.turnRight();
  robot.walk(1);
  robot.turnLeft();
}
