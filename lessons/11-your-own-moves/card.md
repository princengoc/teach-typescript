# Card 11: your own moves

You wrote the moves you had been spending, and the pictures came out the same.

**A move is robot calls under a name. Nothing else.**

```ts
export function paintCells(n: number): void {
  paint();
  for (let i = 1; i < n; i += 1) {
    next();
    paint();
  }
}
```

**A move can spend a move you wrote. `robot.turnLeft()` is a quarter turn left.**

```ts
export function nextRow(): void {
  robot.turnLeft();
  robot.turnLeft();
  backToRowStart();
  robot.turnLeft();
  next();
  robot.turnLeft();
}
```

**What repeats goes inside a move, so the room says how many, not you.**

```ts
for (const width of room.bands) {
  paintBand(width, room.thick);
}
```

## For Racket hands

Cutting a long function into named helpers is what `define` is for. Same habit,
same reason.
