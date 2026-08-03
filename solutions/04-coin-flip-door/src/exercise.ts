import { robot } from './harness/robot';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   robot.paint()       paints the square the robot stands on
//   robot.step()        moves the robot one square forward
//   robot.walk(steps)   walks the robot `steps` squares forward
//   robot.turnLeft()    turns the robot a quarter turn to the left
//   robot.turnRight()   turns the robot a quarter turn to the right
//   robot.wallOnLeft()  a sensor: true when the square on the robot's left...
// --- end of your kit ---

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
