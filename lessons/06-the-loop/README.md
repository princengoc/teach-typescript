# Lesson 06: the loop

**Start here:** look at the preview panel on the right.

Last time you built a staircase by writing the same block three times. This
lesson is how to say a block once and run it many times, two ways: a `for` loop
and recursion. The room picks the size, so copy-paste cannot win.

1. **Read the intro.** It has a worked `for` loop with its counter climbing, a
   worked recursion counting down to its base case, and a move with the size
   typed in that fits one room and misses another. Copy the shape, not the
   numbers.
2. **Climb the ladder**, by filling four functions in `src/exercise.ts` (open on
   the left), top to bottom, each one a loop:
   - `paintSquare` -- `paintSide` four times.
   - `paintRectangle` -- a long side then a short one, twice round.
   - `paintStaircaseLoop` -- the staircase, with a `for` loop.
   - `paintStaircaseRec` -- the same staircase, with a function that calls itself.

   Save. The panel marks every rung in every room. Each function paints one
   thing once to start; turn it into the whole figure.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card: the words for what you just wrote. Read it, then
tell your teacher which of the two ways you liked, and why.

## Rules

- Edit `src/exercise.ts` only. `src/harness/` runs the world; leave it closed.
- `paintSide`, `paintBar`, and `stepToNextBar` are done for you. Spend them; do
  not open them.
- `wordbook.md` lists every word so far. Look there before asking.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/1c174f4f959bd22182939f905a176cfac040bb24/lessons/06-the-loop?file=src%2Fexercise.ts
