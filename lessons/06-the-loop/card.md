# Card 06: the loop

You built four figures without copying a block. Two ways to repeat.

**A `for` loop runs a block again and again. Its three parts are start, keep-going test, step.**

```ts
for (let i = 0; i < n; i += 1) {
  // the block
}
```

**Recursion: a function that calls itself does one step, then hands the rest to another copy of itself, with new numbers.**

```ts
climb(height + 1, barsLeft - 1);
```

**A base case stops it: when nothing is left, `return` before it calls itself again.**

```ts
if (barsLeft === 0) return;
```

## For Racket hands

- The recursion is a named procedure calling itself; the `for` loop is the same
  countdown wearing a mutable counter.
