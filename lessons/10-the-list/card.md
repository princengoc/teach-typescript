# Card 10: the list

A list of numbers came off the room and drew the chart. You typed none of them in.

**A list of numbers has the type `number[]`.**

```ts
interface Room {
  bars: number[];
  min: number;
}
```

**`for...of` hands you each value in turn, so there is nothing to count.**

```ts
for (const n of room.bars) {
  paintCells(n);
  nextRow();
}
```

**Skip a value without skipping its place: the `if` guards the paint, not the row.**

```ts
if (tall(n, room)) paintCells(n);
nextRow();
```

## For Racket hands

`for...of` is `(for ([n bars]) ...)`. A `number[]` is a list of numbers, but a
vector, not a chain of pairs.
