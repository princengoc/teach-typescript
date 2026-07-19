# Card 01: values

Front. Read before you build the room.

## The words

**Statement.** One instruction. It ends with a semicolon. A program is a list
of statements, and it runs them top to bottom.

**`const`** creates a name for a value.

```ts
const startX = 6;
```

From this line on, `startX` means `6`. You cannot give the name a new value
later; if you try, the compiler shows an error.

**Number literal.** A number typed directly into the code, like `6`, `24`, or
`0`.

**Property access.** The dot looks inside a value and picks out one named
part.

```ts
world.robot.x
```

This means: take `world`, find its `robot`, and read that robot's `x`.

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

# Back. Read after you build the room.

**What `const` does not protect.**

```ts
const charger = { x: 7, y: 5 };
charger.x = 9;
```

The second line works. `const` stops you from giving the name `charger` a
whole new value. It does not stop changes inside the object that `charger`
names. Lesson 08 comes back to this.

**`let`.** TypeScript has a second keyword, `let`, for names that are allowed
to get new values. We start using it in lesson 05, when a loop needs a
counter.

**Types.** Every value has a kind: `6` is a number, and `{ x: 7, y: 5 }` is an
object holding two numbers. The kinds are called types, and the compiler
keeps track of them. That is how it caught the typo `robat`: the robot has no
part with that name.
