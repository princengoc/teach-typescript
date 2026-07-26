# Lesson 07: how far?

**Start here:** look at the preview panel on the right.

Every move you have written did something to the room and gave nothing back.
This lesson is how a function works out a number and hands it back, so the rest
of your code can keep it and spend it. The room hides the number: you feel for a
wall and count.

1. **Read the intro.** It has a worked function that counts to a wall and
   returns the number, and a guess with the number typed in that fits one room
   and misses another. Watch the count add itself up.
2. **Climb the ladder**, by filling `src/exercise.ts` (open on the left), top to
   bottom:
   - `measureGap` -- feel your way to the wall, counting the squares, and return
     the count. Then `paintFloatingRow` spends it (written for you).
   - `matchBars` -- `buildFirstBar()` paints the first bar and returns how tall
     it was. Keep that number and build two more bars to match, where no ceiling
     stops you.
   - `climbCounting` -- climb the bar, painting and counting, and return the
     height. Then `climbAndFloor` lays a floor as long (written for you).

   Save. The panel marks every rung in every room, and a surprise room of a new
   size each run. Code that measures fits them all; code that guesses does not.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card: the words for what you just wrote. Read it, then
tell your teacher where else a function that gives a number back would save you.

## Rules

- Edit `src/exercise.ts` only. `src/harness/` runs the world; leave it closed.
- The moves you spend -- `paintCells`, `buildFirstBar`, `paintBar`,
  `goToBuildLane`, `toNextBarFoot`, `goHomeFaceEast` -- are done for you.
- `robot.wallAhead()` is a sensor: `true` when the next step lands on a wall.
  There is no number to read this lesson; you feel the wall and count.
- `wordbook.md` lists every word so far. Look there before asking.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/a9bfd60b91a8d22e9a05e30bc86d318644f99a68/lessons/07-how-far?file=src%2Fexercise.ts
