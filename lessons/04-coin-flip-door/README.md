# Lesson 04: the coin-flip door

**Start here:** look at the preview panel on the right.

You already know what an if and an else do. This lesson is how TypeScript
spells them, and a room that makes you need one.

1. **Read the syntax** in the preview, then meet the room. Half the time the
   door is in the left wall, half the time in the right. Run the same move in
   both and see it paint one and crash the other. Then ask the robot
   `robot.wallOnLeft();` in each room.
2. **Paint the shelf**, by writing `faceTheRoom` in `src/exercise.ts` (open on
   the left). Ask `robot.wallOnLeft()`, then turn the robot the right way for
   each answer: right when the wall is on its left, left when it is not. Save,
   then press "Flip the coin and open the door" as often as you like.

The verdict turns green and reads `PASS` when both rooms work. You do not need
the terminal for this lesson. The preview is your test.

## Then the drills

`drills/` holds five small jobs, and two spare ones if you want more. There is
no robot in them. Start at `01` and work down. Each has a `readme.md` saying
what to do and a `hints.md` if you get stuck. Run one with
`npx vitest run drills/01-true-or-false` in the terminal, or just watch the
errors in the editor.

Come back to the preview for the card when you are through.

## Rules

- Edit `src/exercise.ts` and the files in `drills/` only. `src/harness/` runs
  the world. Leave it closed.
- Your code runs once per room, starting at the top of `paintTheRoom`. Making
  one room work by breaking the other is not a fix.
- `wordbook.md` lists every word so far. Look there before asking.

## The StackBlitz link

https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/04-coin-flip-door?file=src%2Fexercise.ts
