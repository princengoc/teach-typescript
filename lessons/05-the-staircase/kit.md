# Your kit

Everything this lesson hands you, and what each one does. Nothing outside
this page exists yet. Every file named below is in this project, and none
of it is shut to you: open it and read it.

## Your moves

Ready-made, and yours to spend. They live in
`src/harness/moves.ts`, and you may read them.

| Call | What it does | Where from |
| --- | --- | --- |
| `paintCells(n)` | Paints `n` squares in a row, starting on the square the robot stands on and going forward. It paints exactly `n` -- no wall stops it, so `n` is the only thing that can. | new here |
| `nextRow()` | Carries the robot to the first square of the row below, facing along it. It is turns and steps you have spent since lesson 02, under one name. On the bottom row there is no row below, so it stays where it is. | new here |

## The room

Numbers the room hands your code. Read them; do not type in
numbers of your own, because the next room is a different size.
The rooms themselves are built in `src/harness/task.ts`.

| Value | What it is | Where from |
| --- | --- | --- |
| `room.len` | How many squares long the first row is. | new here |

