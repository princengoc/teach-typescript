# Card 01: values

You built the room out of four values. Here are the three words for them.

**`const` gives a value a name.**

```ts
const startX = 6;
```

From that line on, `startX` means `6`. You cannot give it a new value later.

**An object holds values that belong together, each under its own name.**

```ts
const grid = { width: 8, height: 6 };
```

**The dot reads one of them back out.**

```ts
grid.width;
```

That is `8`.

## For Racket hands

- `const startX = 6;` is `(define startX 6)`.
- `grid.width` is `(grid-width grid)`.
