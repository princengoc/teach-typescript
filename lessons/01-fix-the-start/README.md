# Lesson 01: fix the start

One idea: a name is bound to a value, and the program reads it.

The robot in the preview should start at the blue door. It does not. Its
starting square is written in `src/exercise.ts` as two `const` lines. The test
says where the door is.

## Order of work

1. Read the front of `card.md`, then the worked example at the top of
   `src/exercise.ts`.
2. Do the drills, in order: `drills/01` to `drills/04`. In each folder, read
   `readme.md`, edit the one file it names, run `npm test` until green.
3. Capstone: the YOUR TURN section of `src/exercise.ts`. Green tests, and the
   preview shows the robot painting the dashed target from the door.
4. Read the back of `card.md`. Tell your teacher what the robot did wrong
   before your fix, and why.

## Rules

- You edit only the files the readmes name. `src/harness/` is the machine that
  runs the world; leave it closed.
- Done is green tests plus a preview whose verdict reads PASS.

## Running

- `npm test` -- run the tests.
- `npm run dev` -- open the preview.

On StackBlitz, open:
https://stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/01-fix-the-start
