# Card 04: the coin-flip door

How TypeScript spells an if and an else.

**The question goes in round brackets, the block in curly braces. `else` sits
on the line that closed the first block.**

```ts
if (robot.wallOnLeft()) {
  robot.turnRight();
} else {
  robot.turnLeft();
}
```

**The question has to be a boolean: a value that is only ever `true` or
`false`. Comparing two values hands one back.**

```ts
score > 10;
name === 'Bong';
```

**`===` asks whether two values are the same. `!` flips a boolean.**

```ts
squares === 3;
!raining;
```

## For Racket hands

- An `if`-`else` chain is `cond`.
- Racket's `if` hands back a value. This one does not. It picks which lines
  run.
