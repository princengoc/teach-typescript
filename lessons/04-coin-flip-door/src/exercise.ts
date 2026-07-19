import { robot } from './harness/robot';

// The door is a coin flip. Half the time it is in the left wall, half the
// time in the right wall, and the robot cannot tell which until it looks.
// So the code has to ask, and then do one thing or the other.

// The robot's one question. robot.wallOnLeft() hands back a boolean: true
// when the square on the robot's left is a wall, false when it is open room.
function faceTheRoom(): void {
  // Step 1: a wall on the left means the room is on the right, so turn right.
  if (robot.wallOnLeft()) {
    robot.turnRight();
  }

  // Step 2: your turn. No wall on the left means the room is on the left.
  // Add an else after the closing bracket above, and turn the other way.
}

// This is lesson 03's move, written for you. Once the robot faces the room,
// the shelf is the same three squares whichever door it came in by.
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
