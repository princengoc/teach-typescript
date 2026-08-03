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
| `nextRow()` | Carries the robot to the first square of the row below, facing along it. It is turns and steps you have spent since lesson 02, under one name. On the bottom row there is no row below, so it stays where it is. | since lesson 05 |

## The room

Numbers the room hands your code. Read them; do not type in
numbers of your own, because the next room is a different size.
The rooms themselves are built in `src/harness/task.ts`.

| Value | What it is | Where from |
| --- | --- | --- |
| `room.bars` | One number per row: how long that row's bar is. | new here |
| `room.min` | How long a bar has to be to count as tall. | just this room |

