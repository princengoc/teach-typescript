# Card 05: a value that changes

You built the staircase from one number that grew.

**`let` gives a value a name you can change later.**

```ts
let height = 1;
```

**Reassigning hands the name a new value: `=` sets it, `+= 1` adds one to what it already holds.**

```ts
height = 5;
height += 1;
```

**A `const` cannot be reassigned. Reach for `let` only when the value has to move.**

```ts
const first = robot.startHeight();
```

## For Racket hands

- `let` here is a `define` you are allowed to `set!` afterwards.
