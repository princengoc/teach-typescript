# Lesson 08: do the sum yourself

**Start here:** look at the preview panel on the right.

Every move so far, you told the robot what to do. This lesson you write a
**rule** -- a function that gives back `true` or `false` -- and the robot follows
it at every square. Where the rule says yes, it paints. The lane picks its own
numbers, so a rule that reads them fits every lane; a guess with numbers typed
in does not.

1. **Read the intro.** It has a worked rule that paints the back half of a lane,
   and a guess with the squares typed in that fits one lane and misses another.
   Watch the rule paint.
2. **Climb the ladder**, by filling `src/exercise.ts` (open on the left), top to
   bottom:
   - `paintBackHalf` -- the loop is written for you. Write the rule `backHalf`:
     return `true` when a square is at least halfway along (`i >= len / 2`).
   - `paintStripes` -- write both. A rule `stripe(i)` that is `true` on every
     other square (`i % 2 === 0`), and the loop that paints where it says so.
   - `paintBand` -- write both. A rule `band(i)` that is `true` from `room.lo`
     to `room.hi`, ends included (`i >= lo && i <= hi`), and its loop.

   Save. The panel marks every rung in two lanes, and a surprise lane of a new
   size each run. A rule fits them all; a typed-in list does not.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card: the words for what you just wrote. Read it, then
tell your teacher where else a yes-or-no rule would save you from typing a list.

## Rules

- Edit `src/exercise.ts` only. `src/harness/` runs the world; leave it closed.
- The moves you spend -- `paint` and `next` -- are done for you. `paint` colours
  the square the robot stands on; `next` steps to the following one, and stops
  safely at the end of the lane.
- The room hands you its numbers: `room.len`, and for the band `room.lo` and
  `room.hi`. Read them; do not type numbers in.
- `wordbook.md` lists every word so far. Look there before asking.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/c41aba6448a14384ce2466508782893fa0e5611a/lessons/08-do-the-sum?file=src%2Fexercise.ts
