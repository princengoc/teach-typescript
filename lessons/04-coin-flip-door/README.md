# Lesson 04: the coin-flip door

**Start here:** look at the preview panel on the right.

1. **Watch the two rooms** first. Run the same straight-line move in both and
   see it survive one and crash in the other. Then ask the robot
   `robot.wallOnLeft();` in each room and read the two answers.
2. **Paint the shelf**, by finishing `faceTheRoom` in `src/exercise.ts` (open
   on the left). The `if` is written for you; your work is the `else`. Save,
   then press "Flip the coin and open the door" as often as you like.

The verdict turns green and reads `PASS` when both rooms work. You do not need
the terminal for this lesson. The preview is your test.

## Then the drills

`drills/` holds five small jobs with no robot in them, and two spare ones.
Start at `01` and work down. Each has a `readme.md` saying what to do and a
`hints.md` if you get stuck. Run one with
`npx vitest run drills/01-true-or-false` in the terminal, or just watch the
errors in the editor.

Come back to the preview for the card when you are through.

## Rules

- Edit `src/exercise.ts` and the files in `drills/` only. `src/harness/` runs
  the world; leave it closed.
- Your code runs once per room, from the top of `paintTheRoom`. Making one
  room work by breaking the other is not a fix.
- `wordbook.md` lists every word so far. Look there before asking.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/04-coin-flip-door?file=src%2Fexercise.ts
