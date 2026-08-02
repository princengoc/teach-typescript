# Lesson 12: the finale

**Start here:** look at the preview panel on the right.

Nothing here is new. One walk goes over every square of a box, asks a rule about
the square it is standing on, and paints the ones the rule says yes to. Change
the rule and the same walk draws a different picture. Everything you have
written in eleven lessons is in that sentence.

1. **Read the intro.** It walks a small box a square at a time: the rule's
   answer on the left, what the robot did on the right.
2. **Climb the ladder**, by filling `src/exercise.ts` (open on the left), top to
   bottom:
   - `paintBox(room)` -- the walk with no rule at all. Paint every square of a
     box `room.width` across and `room.height` down.
   - `gap(a, b)` and `near(x, y, room)` -- a rule made of arithmetic. A square
     belongs to the diamond when how far across it is, plus how far down it is,
     is no more than `room.reach`. The walk is handed back to you with the rule
     already wired in.
   - `cellNumber(x, y, room)`, `wanted(x, y, room)` and `paintPicture(room)` --
     a rule made of data, and this time the walk is yours as well. Number the
     squares the way you read a book, then paint the ones whose numbers are on
     `room.marks`.

   Save. The panel marks every rung against two rooms, a surprise room drawn
   fresh each run, and your rules asked about every square on their own.

When every rung reads `PASS`, the course is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card. Read it, then tell your teacher what you would have
to change to make the same walk draw a letter of your name.

## Rules

- Edit `src/exercise.ts` only. `src/harness/` runs the world, but you may read
  `src/harness/moves.ts`: `nextRow` in there is the move you wrote last lesson,
  handed back to you.
- Your kit: `paint()` colours the square the robot stands on, `next()` steps to
  the following one and stops safely at the end of a row, `nextRow()` carries
  you to the start of the row below.
- The room hands you its numbers: `room.width`, `room.height`, `room.midX`,
  `room.midY`, `room.reach`, `room.marks`. Read them; do not type numbers in.
- A rule is an answer about one square, and it has to be right about every
  square. The panel asks yours about all of them.
- `wordbook.md` lists every word so far. Look there before asking.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/3f418db792de4ebe8fd94ad584c1c55460ab0118/lessons/12-the-finale?file=src%2Fexercise.ts
