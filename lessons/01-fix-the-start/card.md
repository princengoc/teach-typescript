# Card 01: values

Front. Read before the drills.

## The words

**Statement.** One instruction, ended with a semicolon. A program is a list of
statements, run top to bottom.

**`const`** gives a value a name.

```ts
const startX = 6;
```

Below this line, `startX` means `6`. A `const` name cannot be assigned again;
the compiler rejects the attempt.

**Number literal.** A number written in the code: `6`, `24`, `0`. A literal is
a value, not a name.

**Property access.** A dot reads one named part of a value.

```ts
world.robot.x
```

This reads: in `world`, the `robot`, its `x`.

## This compiles / this does not

| This compiles | This does not |
| --- | --- |
| `const startX = 6;` | `const startX;` -- `'const' declarations must be initialized. ts(1155)` |
| `const startX = 6;` | `startX = 2;` -- `Cannot assign to 'startX' because it is a constant. ts(2588)` |
| `world.robot.x` | `world.robat.x` -- `Property 'robat' does not exist on type 'Robot'. ts(2339)` |

## For Racket hands

- `const startX = 6;` is `(define startX 6)`.
- `world.robot.x` is `(robot-x (world-robot world))`. The dot is the accessor,
  read left to right.
- A Vitest `test` with `expect(a).toBe(b)` is a `check-expect`.

---

# Back. Read after the capstone.

**`const` locks the name, not the value.**

```ts
const charger = { x: 7, y: 5 };
charger.x = 9;
```

The second line compiles. `charger` still names the same object; a value
inside the object changed. Lesson 08 returns to this.

**`let`** declares a name that can be assigned again. It first appears in
lesson 05, where a loop needs a counter.

**Types.** The values in this lesson are numbers and objects of numbers. The
kinds of values are called types. The compiler tracks them; that is why
`world.robat.x` fails to compile.
