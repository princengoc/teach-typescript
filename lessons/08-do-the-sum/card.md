# Card 08: do the sum yourself

You wrote three rules. Each is a function that gives back `true` or `false`, and the robot paints where it says `true`.

**A comparison hands back a boolean -- yes or no. `: boolean` promises one.**

```ts
function backHalf(i: number, width: number): boolean {
  return i >= width / 2;
}
```

**`%` is the remainder after dividing. `i % 2 === 0` is every other square.**

```ts
return i % 2 === 0;
```

**`&&` joins two tests: it is `true` only when both sides are.**

```ts
return y >= room.lo && y <= room.hi;
```

## For Racket hands

- These are predicates: procedures that return a boolean. `>= % &&` are the same
  `>=`, `modulo`, and `and` you know, written for the infix world.
