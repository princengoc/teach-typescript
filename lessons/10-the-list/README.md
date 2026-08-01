# Lesson 10: the list

**Start here:** look at the preview panel on the right.

Until now a room handed you one number at a time. This room hands you a whole
**list**: `room.bars`, a `number[]`. Each number is one bar of a chart, and
`for...of` hands them to you one at a time. The data draws the picture.

1. **Read the intro.** It walks one list, then runs the same loop against two
   different lists. The code does not change; the charts do.
2. **Climb the ladder**, by filling `src/exercise.ts` (open on the left), top to
   bottom:
   - `paintChart` -- swap `const n = room.min;` for `for (const n of room.bars)`
     around the two lines under it, so every number gets its bar.
   - `paintChartByHand` -- `paintCells` has gone home. Its work is spelled out
     for one bar; wrap it in the list loop and let each bar stop at its own `n`.
   - `paintTallBars` -- write the rule `tall(n, room)` and paint only the bars it
     says yes to. Every number still keeps its row.

   Save. The panel marks every rung against two lists, and a surprise list drawn
   fresh each run. A loop that reads `room.bars` fits them all.

When every rung reads `PASS`, the ladder is done. You do not need the terminal
for this lesson. The preview is your test.

## After the ladder

The preview shows the card: the words for what you just wrote. Read it, then
tell your teacher what would happen to your chart if someone added one more
number to the list.

## Rules

- Edit `src/exercise.ts` only. `src/harness/` runs the world; leave it closed.
- The moves you spend are done for you. `paint` colours the square the robot
  stands on; `next` steps to the following one and stops safely at the end of a
  row; `paintCells(n)` paints a bar `n` squares long; `nextRow` carries the robot
  to the first square of the row below.
- The room hands you its list: `room.bars`, and `room.min` for how long a bar
  must be to count as tall. Read them; do not type numbers in.
- Walk the list with `for...of`. It is the only way in you need.
- `wordbook.md` lists every word so far. Look there before asking.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/10-the-list?file=src%2Fexercise.ts
