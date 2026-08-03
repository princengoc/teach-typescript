# Lesson 10: the list

**Start here:** look at the preview panel on the right.

Until now a room handed you one number at a time. This room hands you a whole
**list**: `room.bars`, a `number[]`. Each number is one bar of a chart, and
`for...of` hands them to you one at a time. The data draws the picture.

1. **Read the intro.** It walks one list, then runs the same loop against two
   different lists. The code does not change; the charts do.
2. **Climb the ladder**, by filling `src/exercise.ts` (open on the left), top to
   bottom:
   - `paintChart` -- one bar is spelled out for a fixed length. Wrap it in
     `for (const n of room.bars)`, let each bar stop at its own `n`, and call
     `nextRow()` at its foot.
   - `paintTallBars` -- write the rule `tall(n, room)` and paint only the bars it
     says yes to. Every number still keeps its row.
   - `paintTallest` -- one row, as long as the longest number in the list. Walk
     the whole list carrying the best answer so far, and only take a number when
     it beats what you are holding.

   Save. The panel marks every rung against two lists, and a surprise list drawn
   fresh each run. A loop that reads `room.bars` fits them all.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card: the words for what you just wrote. Read it, then
tell your teacher what would happen to your chart if someone added one more
number to the list.

## Rules

- Edit `src/exercise.ts` only. Everything in `src/harness/` runs the world, and
  changing it changes the test you are meant to pass.
- Read anything you like. The three moves you spend are in
  `src/harness/moves.ts`: `paint` colours the square the robot stands on, `next`
  steps to the following one and stops safely at the end of a row, and `nextRow`
  carries the robot to the first square of the row below.
- Painting a whole row is **not** a move this lesson. You write that loop out,
  and you write it three times. Notice how that feels; lesson 11 is where you
  fold it back into a move of your own.
- The room hands you its list: `room.bars`, and `room.min` for how long a bar
  must be to count as tall. Read them; do not type numbers in.
- Walk the list with `for...of`. It is the only way in you need.
- Forgotten a call? Press **Your kit** in the preview: every move and every
  number the room hands you, with what each one does and which file it lives in.
  `kit.md` and `wordbook.md` hold the same words in the file tree.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/10-the-list?file=src%2Fexercise.ts
