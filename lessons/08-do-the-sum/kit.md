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
| `paintCells(n)` | Paints `n` squares in a row, starting on the square the robot stands on and going forward. It paints exactly `n` -- no wall stops it, so `n` is the only thing that can. | since lesson 05 |
| `nextRow()` | Carries the robot to the first square of the row below, facing along it. It is turns and steps you have spent since lesson 02, under one name. On the bottom row there is no row below, so it stays where it is. | since lesson 05 |

## The room

Numbers the room hands your code. Read them; do not type in
numbers of your own, because the next room is a different size.
The rooms themselves are built in `src/harness/task.ts`.

| Value | What it is | Where from |
| --- | --- | --- |
| `room.width` | How many squares across the box reaches. | back from lesson 06 |
| `room.height` | How many rows down the box reaches. | back from lesson 06 |
| `room.lo` | The first row of the band. | just this room |
| `room.hi` | The last row of the band. | just this room |

