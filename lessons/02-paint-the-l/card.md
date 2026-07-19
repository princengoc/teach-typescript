# Card 02: calling functions

You painted the L by telling the robot what to do, one instruction at a time.
Here are the words for what you wrote.

## The words

**Function call.** An instruction that makes something happen. You write the
name of the thing you want, then a pair of brackets.

```ts
robot.paint();
```

The brackets are what makes it happen. `robot.paint` on its own is not an
error, and it does nothing at all: it names the paint job without asking for
it. This is the most common way to write a program that runs and paints
nothing.

**Method.** A function that belongs to a value. `paint` belongs to `robot`, so
you reach it with the dot, the same dot that read `grid.width` in lesson 01.

**Empty brackets.** `()` with nothing inside means the call needs nothing
extra. `robot.step()` always steps one square; there is nothing to choose.
Lesson 03 starts putting things inside the brackets.

**Execution order.** The calls run top to bottom, one after another. Swap two
lines and the robot does the same two things in the other order, which is
usually a different picture. `paint` then `step` paints where it came from;
`step` then `paint` paints where it arrived.

**`;`** ends one instruction. It is how you say where a call stops and the
next one starts.

## This compiles / this does not

| This compiles | This does not |
| --- | --- |
| `robot.paint();` | `robot.pain();` -- `Property 'pain' does not exist on type '{ paint(): void; step(): void; turnLeft(): void; turnRight(): void; }'. Did you mean 'paint'? ts(2551)` |
| `robot.turnLeft();` | `robot.turnleft();` -- `Property 'turnleft' does not exist on type ... Did you mean 'turnLeft'? ts(2551)` |
| `robot.step();` | `robot.step(2);` -- `Expected 0 arguments, but got 1. ts(2554)` |

The last one is the compiler telling you that `step` means one square, always.
If you want two, you call it twice.

## Moves, not squares

You never typed a square number. You wrote moves, and moves are relative: the
robot does them from wherever it is standing. That is why the same calls paint
the L from any door. Had you written the squares down instead, the script
would only ever have worked in one room.

## Two things coming later

**Your own functions.** Lesson 03 lets you make a call of your own, so that
`paintShelf()` means those seven lines you just wrote. Right now you can only
call the ones the robot already has.

**What goes in the brackets.** Values you put inside the brackets are called
arguments, and the function reads them to decide what to do. That is lesson
03, along with the word for the slot they land in.

## For Racket hands

- `robot.paint();` is `(paint robot)`. The receiver moves to the front of the
  brackets in TypeScript, and the dot leads you to it.
- A run of calls one under another is a body of expressions, evaluated in
  order, exactly like the body of a `define`.
- The `;` does the job Racket gives to the closing bracket: it marks the end
  of one instruction.
