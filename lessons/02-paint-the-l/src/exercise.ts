import { robot } from './harness/robot';

// --- your kit ---
// Everything you can call this lesson. The "Your kit" button in the
// preview says more about each one.
//   robot.paint()      paints the square the robot stands on
//   robot.step()       moves the robot one square forward
//   robot.turnLeft()   turns the robot a quarter turn to the left
//   robot.turnRight()  turns the robot a quarter turn to the right
// --- end of your kit ---

// The robot comes through the door facing south, and paints the L below it.
// Each line is one call: one thing the robot does. They run top to bottom.

// Step 1: paint the square the robot is standing on.
robot.paint();

// Step 2: move one square forward, then paint that one too.
robot.step();
robot.paint();

// Step 3: your turn. Paint one more square down to finish the tall arm.

// Step 4: turn the corner with robot.turnLeft(), then paint the two squares
// of the foot. Remember: the robot has to step onto a square before it can
// paint it.
