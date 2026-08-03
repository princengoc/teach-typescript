# Lesson 09: the grid

**Start here:** look at the preview panel on the right.

You can paint a row. A box is rows, stacked. This lesson you put the row loop
**inside another loop**, so one block of code paints the whole box. Two counters
run at once: `y` for the row, `x` for the square.

1. **Read the intro.** It wraps a row loop you already know in a loop of rows,
   then traces it beat by beat: watch `y` tick once while `x` ticks a whole row.
2. **Climb the ladder**, by filling `src/exercise.ts` (open on the left), top to
   bottom:
   - `fillBox` -- the row loop is written for you. Wrap it in an outer loop that
     counts `y` up to `room.height`.
   - `paintChecker` -- write both loops, and the rule `black(x, y)` that is true
     when `(x + y) % 2 === 0`. The rule reads both counters.
   - `paintStaircase` -- fix `rowWidth` so row `y` is `y` squares shorter than
     the top, then write the loops. The inner one stops at the number
     `rowWidth(y, room)` hands back, so every row is shorter than the last.

   Save. The panel marks every rung in two boxes, and a surprise box of a new
   size each run. Loops that read `room.width` and `room.height` fit them all.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card: the words for what you just wrote. Read it, then
tell your teacher which loop ran more times, and how many times over.

## Rules

- Edit `src/exercise.ts` only. Everything in `src/harness/` runs the world, and
  changing it changes the test you are meant to pass.
- Read anything you like. The three moves you spend are in
  `src/harness/moves.ts`: `paint` colours the square the robot stands on, `next`
  steps to the following one and stops safely at the end of a row, and `nextRow`
  carries the robot to the first square of the row below. Open `nextRow` -- it
  is turns, steps and a recursion you have written yourself.
- The room hands you its numbers: `room.width` and `room.height`. Read them; do
  not type numbers in.
- Forgotten a call? Press **Your kit** in the preview: every move and every
  number the room hands you, with what each one does and which file it lives in.
  `kit.md` and `wordbook.md` hold the same words in the file tree.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/09-the-grid?file=src%2Fexercise.ts
