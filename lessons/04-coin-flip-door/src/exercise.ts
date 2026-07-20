import { robot } from './harness/robot';

// robot.wallOnLeft() is true when the square on the robot's left is a wall.
// Wall on the left, turn right. No wall, turn left.
function faceTheRoom(): void {
  // Your turn. Ask robot.wallOnLeft(), then turn the robot the right way for
  // each answer: right when the wall is on its left, left when it is not.
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
