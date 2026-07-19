import { robot } from './harness/robot';

// robot.wallOnLeft() is true when the square on the robot's left is a wall.
// Wall on the left, turn right. No wall, turn left.
function faceTheRoom(): void {
  if (robot.wallOnLeft()) {
    robot.turnRight();
  } else {
    robot.turnLeft();
  }
}

// From lesson 03.
function paintShelf(): void {
  robot.paint();
  robot.walk(1);
  robot.paint();
  robot.walk(1);
  robot.paint();
}

// The harness runs this once per room. Do not rename it.
export function paintTheRoom(): void {
  faceTheRoom();
  paintShelf();
}
