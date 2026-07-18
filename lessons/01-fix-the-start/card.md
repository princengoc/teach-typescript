# Card 01: values

Read this side before the drills.

## The words

**Statement.** One instruction, ended by a semicolon. The program runs its
statements top to bottom.

**`const`.** Makes a name and binds it to a value: `const startX = 6;` says
"the name `startX` holds 6". The binding cannot change: once a `const` line has
run, that name holds that value for good.

**Number literal.** A number written out: `6`, `24`, `0`. The value itself.

**Property access.** Reading a value that lives inside another value, with a
dot. `world.robot.x` reads: the world, its robot, its x. Say it aloud as "the
robot's x".

## This compiles / this does not

| This compiles | This does not |
| --- | --- |
| `const startX = 6;` | `const startX;` -- TS1155: 'const' declarations must be initialized. |
| `const startX = 6;`<br>`const startY = 1;` | `const startX = 6;`<br>`startX = 2;` -- TS2588: Cannot assign to 'startX' because it is a constant. |
| `world.robot.x` | `world.robat.x` -- TS2339: Property 'robat' does not exist on type 'Robot'. (The compiler catches typos in names.) |

## For Racket hands

`const startX = 6;` is `(define startX 6)`. The dot does what a struct accessor
did: `world.robot.x` is `(robot-x (world-robot world))`, read left to right. A
Vitest `test` with `expect(...).toBe(...)` is a `check-expect`.

---

Read this side after the capstone.

## The back of the card

- `const` locks the name, not the world: later you will meet values whose
  insides can still change even though the name cannot be rebound. That lesson
  waits for arrays.
- TypeScript also has `let`, which makes a name that can be rebound. We will
  not touch it until a loop needs a counter, in lesson 5.
- Every name in this lesson held a number. Names can hold any kind of value;
  the kinds are called types, and the compiler tracks them so a typo like
  `robat` dies before the program runs.
