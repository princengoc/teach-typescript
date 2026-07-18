# Card 01: values

Read this front before the drills. Keep it open next to the code: the code
shows the words working, the card says exactly what they mean.

**This lesson:** you place things in the world by naming numbers, and you read
numbers back out of the world.

## The words

**Statement.** One complete instruction, ended with `;`. A program is
statements, run top to bottom.

**`const`** starts a statement that gives a value a name.

```ts
const startX = 6;
```

After that line runs, `startX` means `6` everywhere below it. A name made with
`const` cannot be pointed at a new value: the compiler stops you.

**Number literal.** A number written out in the code: `6`, `24`, `0`. It is a
value itself, not a name for one.

**The dot** reaches into a value and picks one part by name.

```ts
world.robot.x
```

reads: in `world`, the `robot`, its `x`. Say it aloud as "the robot's x".

## This compiles / this does not

| This compiles | This does not |
| --- | --- |
| `const startX = 6;` | `const startX;` -- `'const' declarations must be initialized. ts(1155)` |
| `const startX = 6;` | `startX = 2;` -- `Cannot assign to 'startX' because it is a constant. ts(2588)` |
| `world.robot.x` | `world.robat.x` -- `Property 'robat' does not exist on type 'Robot'. ts(2339)` |

## For Racket hands

- `const startX = 6;` is `(define startX 6)`.
- `world.robot.x` is `(robot-x (world-robot world))`: the dot is the accessor,
  read left to right.
- A Vitest `test` with `expect(a).toBe(b)` is a `check-expect`.

---

# The back

Read this after the capstone is green.

**The truth we postponed.** `const` locks the name, not the value.

```ts
const charger = { x: 7, y: 5 };
charger.x = 9;
```

The second line compiles: you did not point `charger` at anything new, you
changed something inside what it holds. Lesson 08 uses this on purpose.

**The other keyword.** TypeScript also has `let`, which makes a name that can
be re-pointed. We do not touch it until a loop needs a counter, in lesson 05.

**Types.** Every name in this lesson held a number, or a grouping of numbers.
The kinds of values are called types, and the compiler tracks them. That is
how `robat` died before the program ever ran.
