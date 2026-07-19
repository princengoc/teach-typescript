import { robot } from './harness/robot';

// The robot comes through the door facing south, and paints the L below it.
// Each line is one call: one thing the robot does. They run top to bottom.

// Step 1: paint the square the robot is standing on.
robot.paint();

// Step 2: move one square forward, then paint that one too.
robot.step();
robot.paint();

// Step 3: your turn. Paint one more square down to finish the tall arm.
robot.step();
robot.paint();

// Step 4: turn the corner with robot.turnLeft(), then paint the two squares
// of the foot. Remember: the robot has to step onto a square before it can
// paint it.
robot.turnLeft();
robot.step();
robot.paint();
robot.step();
robot.paint();
