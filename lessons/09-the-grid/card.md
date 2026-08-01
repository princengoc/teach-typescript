# Card 09: the grid

You walked a whole box with two loops. The outer one counts rows; the inner one paints a row.

**A loop inside a loop: the outer goes round once per row, the inner once per square.**

```ts
for (let y = 0; y < room.height; y += 1) {
  for (let x = 0; x < room.width; x += 1) {
    paint();
    next();
  }
  nextRow();
}
```

**The inner loop can read the outer loop's counter, so a rule can see both.**

```ts
if ((x + y) % 2 === 0) paint();
```

**The inner loop can stop at a number a function hands back, so rows differ.**

```ts
for (let x = 0; x < rowWidth(y, room); x += 1) {
  paint();
  next();
}
```

## For Racket hands

Same as nesting one `for` inside another. Racket lets you fold the two into one
`for*`; TypeScript always writes them out, one loop per bracket.
