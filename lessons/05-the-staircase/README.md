# Lesson 05: the staircase

**Start here:** look at the preview panel on the right.

You know `const`: a name that never changes. This lesson is `let`, a name that
can, and a staircase that makes you need one.

1. **Watch the counter** climb. Press `len += 1` and see one value take a new
   value each press. Then meet the room: three rows, each one square longer
   than the one above, and a first-row length the room picks, not you. Run code
   with the lengths typed in and watch it fit one room and miss the other. Then
   read `room.len` in each.
2. **Build the staircase**, by finishing `paintStaircase` in `src/exercise.ts`
   (open on the left). The first row is done. Your job is the two longer ones:
   give the length a name you can change, and grow it by one for each. Save,
   then press the button as often as you like.

When the verdict turns green and reads `PASS`, both rooms stand. You do not
need the terminal for this lesson. The preview is your test.

## After the staircase

The preview shows the card: the words for what you just wrote. Read it, tell
your teacher what `let` gives you that `const` did not, then open lesson 6.

## Rules

- Edit `src/exercise.ts` only. Everything in `src/harness/` runs the world, and
  changing it changes the test you are meant to pass.
- Read anything you like. `paintCells` and `nextRow` are done for you, and they
  live in `src/harness/moves.ts`: open it. There is no magic in there, only
  `robot.paint()`, `robot.walk()` and turns you have been calling since lesson
  2. A move is a name over calls you already know.
- Forgotten a call? Press **Your kit** in the preview: every move, and every
  number the room hands you, with what each one does and which file it lives
  in. `kit.md` and `wordbook.md` hold the same words in the file tree.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/05-the-staircase?file=src%2Fexercise.ts
