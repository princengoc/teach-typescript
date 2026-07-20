import { robot } from './robot';

// Two moves from an earlier lesson, handed to you ready-made. You do not open
// them; you spend them.

// Paints one bar, `height` squares tall, starting from the square the robot
// stands on and going up. It leaves the robot back where it began, facing the
// same way, so the next move starts from a known spot.
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
export function goToNextBar(): void {
  robot.turnRight();
  robot.walk(1);
  robot.turnLeft();
}
