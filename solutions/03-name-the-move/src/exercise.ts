import { robot } from './harness/robot';

// The room has three shelves to paint. Every shelf is the same three squares
// in a row. So write the move once, give it a name, and spend the name three
// times.

// This is a definition. The name is paintShelf. The lines between the curly
// brackets are the move. Nothing happens here: a definition only says what
// the move is. Calling the name is what runs it.
function paintShelf(): void {
  // Step 1: paint the square the robot is standing on.
  robot.paint();

  // Step 2: walk one square forward, then paint that one too. The 1 is an
  // argument: it is how you tell walk how far to go.
  robot.walk(1);
  robot.paint();

  // Step 3: your turn. One more square finishes the shelf.
  robot.walk(1);
  robot.paint();

  // Step 4: send the robot home. A move that ends where it started can be
  // used again straight away. Turn it around with two left turns, walk it
  // back, then turn it around again so it faces the way it did before.
  robot.turnLeft();
  robot.turnLeft();
  robot.walk(2);
  robot.turnLeft();
  robot.turnLeft();
}

// This one is written for you. Read it: three calls, one name.
function goToNextShelf(): void {
  robot.turnRight();
  robot.walk(2);
  robot.turnLeft();
}

// The robot comes in facing south. Turn it to face along the first shelf.
robot.turnLeft();

// Now spend the name. Three calls, and every shelf is painted the same way.
paintShelf();
goToNextShelf();
paintShelf();
goToNextShelf();
paintShelf();
