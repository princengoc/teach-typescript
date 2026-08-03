# Lesson 11: your own moves

**Start here:** look at the preview panel on the right.

For four lessons you have spent moves someone else wrote. Open
`src/harness/moves.ts` and see what a move really is: robot calls under a name.
`paintCells` and `nextRow` have been taken out of it. You write them, and the
pictures you drew before have to come out the same.

1. **Read the intro.** It unfolds two of your moves into the robot calls
   underneath, one call at a time. A few names, a pile of calls.
2. **Climb the ladder**, by filling `src/exercise.ts` (open on the left), top to
   bottom:
   - `paintCells(n)` -- paint exactly `n` squares in a row. The lane is wider
     than `n`, so nothing stops you at the right place except `n`.
   - `backToRowStart()` and `nextRow()` -- walk back along the row until the wall
     stops you, then carry the robot down to the row below. The chart loop is
     written for you and draws nothing until both moves are right.
   - `paintBand(width, rows)` and `paintBands(room)` -- a working mess is handed
     to you: the same two lines copied three times, so it can only paint
     three-row bands. Fix `paintBand`, then cut `paintBands` down to spend it.

   Save. The panel marks every rung against two rooms, a surprise room drawn
   fresh each run, and your moves called on their own.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card. Read it, then tell your teacher which was shorter to
write: the mess in rung 3, or the move you cut out of it.

## Rules

- Edit `src/exercise.ts` only. `src/harness/` runs the world, but you may read
  `src/harness/moves.ts`: it is the lesson.
- You are handed two moves and the robot. `paint()` colours the square the robot
  stands on; `next()` steps to the following one and stops safely at the end of a
  row; `robot.turnLeft()` turns a quarter turn left; `robot.wallAhead()` is the
  sensor from lesson 06.
- The room hands you its numbers: `room.run`, `room.bars`, `room.bands`,
  `room.thick`. Read them; do not type numbers in.
- A move has to work on its own, not only inside the picture. The panel calls
  each one by itself.
- Forgotten a call? Press **Your kit** in the preview: every move, every robot
  call, and every number the room hands you, with what each one does and which
  file it lives in. `kit.md` and `wordbook.md` hold the same words in the file
  tree.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/11-your-own-moves?file=src%2Fexercise.ts
