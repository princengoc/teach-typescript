# Card 01: values

You built the room out of four values. Here are the words for what you wrote,
and what the compiler says when one of them is wrong. Keep this card; these
words come back in every lesson.

## The words

**Statement.** One instruction. It ends with a semicolon. A program is a list
of statements, and it runs them top to bottom.

**`const`** creates a name for a value.

```ts
const startX = 6;
```

From this line on, `startX` means `6`. You cannot give the name a new value
later; if you try, the compiler shows an error.

**Number literal.** A number typed directly into the code, like `6`, `8`, or
`0`. Every value you wrote today was one.

**Object.** A group of values that belong together, each under its own name.

```ts
const grid = { width: 8, height: 6 };
```

**Property access.** The dot looks inside a value and picks out one named
part. `grid.width` is `8`.

## This compiles / this does not

| This compiles | This does not |
| --- | --- |
| `const startX = 6;` | `const startX;` -- `'const' declarations must be initialized. ts(1155)` |
| `const startX = 6;` | `startX = 2;` -- `Cannot assign to 'startX' because it is a constant. ts(2588)` |
| `grid.width` | `grid.widht` -- `Property 'widht' does not exist on type '{ width: number; height: number; }'. Did you mean 'width'? ts(2551)` |

## What `const` does not protect

```ts
const charger = { x: 7, y: 5 };
charger.x = 9;
```

The second line works. `const` stops you from giving the name `charger` a
whole new value. It does not stop changes inside the object that `charger`
names. Lesson 08 comes back to this.

## Two things coming later

**The `let` keyword.** TypeScript has a second way to name a value, for names
that are allowed to get new values. We start using it in lesson 05, when a
loop needs a counter.

**Types.** Every value has a kind: `6` is a number, and `{ x: 7, y: 5 }` is an
object holding two numbers. The kinds are called types, and the compiler keeps
track of them. That is how it catches `widht`: the grid has no part with that
name.

## For Racket hands

- `const startX = 6;` is `(define startX 6)`.
- `grid.width` is `(grid-width grid)`. The dot is the accessor, read left to
  right.
- A Vitest `test` with `expect(a).toBe(b)` is a `check-expect`.
