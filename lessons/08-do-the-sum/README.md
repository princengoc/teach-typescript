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
   - `paintBackHalf` -- the loop is written for you. Fix the rule `backHalf`:
     return `true` when a square is at least halfway along (`i >= width / 2`).
   - `paintStripes` -- the rule and the loop are both yours. `stripe(i)` is
     `true` on every other square (`i % 2 === 0`); the loop paints where it says
     so.
   - `paintBandRows` -- both again, and step out of the lane. The room is a box,
     and the rule is asked about a whole row: `bandRow(y, room)` is `true` from
     `room.lo` to `room.hi`, ends included (`y >= lo && y <= hi`). Where it says
     yes, `paintCells(room.width)` paints the row right across; `nextRow()`
     drops to the next one, painted or not.

   Save. The panel marks every rung in two rooms, and a surprise room of a new
   size each run. A rule fits them all; a typed-in list does not.

   Each rule is marked twice: in the picture, and on its own. The panel asks
   your rule about every square of every room, so a rule that is right reads
   `PASS` while its loop is still wrong -- and a picture painted some other way
   does not stand in for the rule.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card: the words for what you just wrote. Read it, then
tell your teacher where else a yes-or-no rule would save you from typing a list.

## Rules

- Edit `src/exercise.ts` only. Everything in `src/harness/` runs the world, and
  changing it changes the test you are meant to pass.
- Read anything you like. All four moves you spend -- `paint`, `next`,
  `paintCells` and `nextRow` -- are in `src/harness/moves.ts`, and that file is
  the whole of them.
- The room hands you its numbers: `room.width` and `room.height`, and for the
  band `room.lo` and `room.hi`. Read them; do not type numbers in.
- Forgotten a call? Press **Your kit** in the preview: every move and every
  number the room hands you, with what each one does and which file it lives in.
  `kit.md` and `wordbook.md` hold the same words in the file tree.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/08-do-the-sum?file=src%2Fexercise.ts
