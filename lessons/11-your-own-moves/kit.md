# Your kit

Everything this lesson hands you, and what each one does. Nothing outside
this page exists yet. Every file named below is in this project, and none
of it is shut to you: open it and read it.

## Your moves

Ready-made, and yours to spend. They live in
`src/harness/moves.ts`, and you may read them.

| Call | What it does | Where from |
| --- | --- | --- |
| `paint()` | Paints the square the robot stands on. | since lesson 07 |
| `next()` | Steps forward to the next square. At the end of a row a wall is ahead, so this stops instead of walking off: the last step is safe to call. | since lesson 07 |

## Yours to write

Handed to you before, and this lesson you write them yourself.
They are in `src/exercise.ts`, under your own name.

| Call | What it does | Where from |
| --- | --- | --- |
| `paintCells(n)` | Paints `n` squares in a row, starting on the square the robot stands on and going forward. It paints exactly `n` -- no wall stops it, so `n` is the only thing that can. | you write it here |
| `nextRow()` | Carries the robot to the first square of the row below, facing along it. It is turns and steps you have spent since lesson 02, under one name. On the bottom row there is no row below, so it stays where it is. | you write it here |

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
| `robot.wallAhead()` | A sensor: true when the next step lands on a wall. There is no number to read this lesson: you feel the wall, and count the steps. | since lesson 06 |

## The room

Numbers the room hands your code. Read them; do not type in
numbers of your own, because the next room is a different size.
The rooms themselves are built in `src/harness/task.ts`.

| Value | What it is | Where from |
| --- | --- | --- |
| `room.run` | How many squares long one run is. | just this room |
| `room.bars` | One number per row: how long that row's bar is. | since lesson 10 |
| `room.bands` | One number per band: how long that band's bar is. | just this room |
| `room.thick` | How many rows deep every band goes. | just this room |

