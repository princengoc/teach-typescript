# Card 07: how far?

You built three figures from numbers you measured, not numbers you were told.

**A return type says what a function hands back. `: number` promises a number.**

```ts
function measureGap(): number {
```

**A recursion can hand a number back: the last step returns a value, and each step adds to what the rest returns.**

```ts
if (robot.wallAhead()) return 1;
return 1 + measureGap();
```

**Keep the returned number in a name, then spend it -- as many times as you like.**

```ts
const height = buildFirstBar();
paintBar(height);
paintBar(height);
```

## For Racket hands

- This is a procedure that returns instead of one called only for effect. `1 +`
  the recursive call is the same accumulate-on-the-way-back you already know.
