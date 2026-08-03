# Your kit

Everything this lesson hands you, and what each one does. Nothing outside
this page exists yet. Every file named below is in this project, and none
of it is shut to you: open it and read it.

## Your moves

Ready-made, and yours to spend. They live in
`src/harness/moves.ts`, and you may read them.

| Call | What it does | Where from |
| --- | --- | --- |
| `paintCells(n)` | Paints `n` squares in a row, starting on the square the robot stands on and going forward. It paints exactly `n` -- no wall stops it, so `n` is the only thing that can. | since lesson 05 |
| `nextRow()` | Carries the robot to the first square of the row below, facing along it. It is turns and steps you have spent since lesson 02, under one name. On the bottom row there is no row below, so it stays where it is. | since lesson 05 |

## The robot

The robot itself. One call, one thing done. It lives in
`src/harness/robot.ts`, under everything else you spend.

| Call | What it does | Where from |
| --- | --- | --- |
| `robot.paint()` | Paints the square the robot stands on. | since lesson 02 |
| `robot.step()` | Moves the robot one square forward. | since lesson 02 |
| `robot.walk(steps)` | Walks the robot `steps` squares forward. | since lesson 03 |
| `robot.turnLeft()` | Turns the robot a quarter turn to the left. | since lesson 02 |
| `robot.turnRight()` | Turns the robot a quarter turn to the right. | since lesson 02 |
| `robot.wallAhead()` | A sensor: true when the next step lands on a wall. Not a number: when there is no number to read, the robot feels for the wall instead. | new here |

## The room

Numbers the room hands your code. Read them; do not type in
numbers of your own, because the next room is a different size.
The rooms themselves are built in `src/harness/task.ts`.

| Value | What it is | Where from |
| --- | --- | --- |
| `room.side` | How long one side of this room's square is. | just this room |
| `room.width` | How many squares across the box reaches. | new here |
| `room.height` | How many rows down the box reaches. | new here |
| `room.len` | How many squares long the first row is. | since lesson 05 |

