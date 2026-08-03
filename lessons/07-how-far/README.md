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
   - `matchRows` -- measure the top row once with your own `measureGap`, keep
     the number, and paint three rows under it to match. Once you have dropped a
     row there is no wall left to feel, so the number has to be kept.
   - `paintToWall` -- paint the top row as you count it, and return the count.
     Then `paintAndMatch` matches it below (written for you).

   Save. The panel marks every rung in every room, and a surprise room of a new
   size each run. Code that measures fits them all; code that guesses does not.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card: the words for what you just wrote. Read it, then
tell your teacher where else a function that gives a number back would save you.

## Rules

- Edit `src/exercise.ts` only. Everything in `src/harness/` runs the world, and
  changing it changes the test you are meant to pass.
- Read anything you like. Two new moves arrive this lesson, and both are one
  line each in `src/harness/moves.ts`: `paint()` paints the square you stand on,
  and `next()` steps to the one after it, stopping at a wall instead of walking
  off. They are the smallest moves there are, and every lesson after this is
  built out of them.
- `robot.wallAhead()` is a sensor: `true` when the next step lands on a wall.
  This is the one lesson with no `room` to read at all; you feel the wall and
  count.
- Forgotten a call? Press **Your kit** in the preview: every move and every
  robot call, with what each one does and which file it lives in. `kit.md` and
  `wordbook.md` hold the same words in the file tree.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/07-how-far?file=src%2Fexercise.ts
