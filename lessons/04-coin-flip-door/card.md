# Card 04: the coin-flip door

You wrote code that looks at the room before it moves.

**A boolean is a value that is only ever `true` or `false`. Asking a question
makes one, and `!` flips one.**

```ts
robot.wallOnLeft();
score > 10;
name === 'Bong';
!raining;
```

**`if` runs the block after it only when the boolean in its brackets is
true.**

```ts
if (robot.wallOnLeft()) {
  robot.turnRight();
}
```

**`else` names the block to run instead, when that boolean is false. One of
the two blocks always runs, never both.**

```ts
if (robot.wallOnLeft()) {
  robot.turnRight();
} else {
  robot.turnLeft();
}
```

## For Racket hands

- An `if`-`else` chain is `cond`.
- Racket's `if` hands back a value. This one does not: it picks which lines
  run.
