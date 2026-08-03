# Lesson 06: the loop

**Start here:** look at the preview panel on the right.

Last time you built a staircase by writing the same block three times. This
lesson is how to say a block once and run it many times, two ways: a `for` loop
and recursion. The room picks the size, so copy-paste cannot win.

1. **Read the intro.** It has a worked `for` loop with its counter climbing, a
   worked recursion counting down to its base case, and a move with the size
   typed in that fits one room and misses another. Copy the shape, not the
   numbers.
2. **Climb the ladder**, by filling five functions in `src/exercise.ts` (open on
   the left), top to bottom:
   - `paintSquare` -- one side and the turn after it, four times.
   - `paintRectangle` -- a long side then a short one, twice round.
   - `paintStaircaseLoop` -- lesson 5's staircase, with a `for` loop, and as
     many rows as the room asks for.
   - `paintStaircaseRec` -- the same staircase, with a function that calls itself.
   - `paintSquareBlind` -- a square whose side is hidden. You are not told the
     number and it changes every run. This room hands you no numbers at all, so
     `paintCells` has no length to take. `robot.wallAhead()` is true when the
     next step lands on a wall. Paint the whole square with recursion; it must
     work for every side.

   Save. The panel marks every rung in every room. Each function paints one
   thing once to start; turn it into the whole figure.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card: the words for what you just wrote. Read it, then
tell your teacher which of the two ways you liked, and why.

## Rules

- Edit `src/exercise.ts` only. Everything in `src/harness/` runs the world, and
  changing it changes the test you are meant to pass.
- Read anything you like. `paintCells` and `nextRow` are lesson 5's moves, still
  in `src/harness/moves.ts`: open it. `nextRow` is a recursion feeling for the
  wall, which is the rung 5 you are about to write.
- `robot.wallAhead()` is a sensor: it hands back `true` when the next step lands
  on a wall. The blind square is the only rung that needs it.
- Forgotten a call? Press **Your kit** in the preview: every move, every robot
  call, and every number the room hands you, with what each one does and which
  file it lives in. `kit.md` and `wordbook.md` hold the same words in the file
  tree.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/06-the-loop?file=src%2Fexercise.ts
