# Card 02: calling functions

You told the robot what to do, one call at a time.

**A call makes something happen. The brackets are what makes it run.**

```ts
robot.paint();
```

**Leave the brackets off and nothing happens.** This is not an error. It is
also not a paint job.

```ts
robot.paint;
```

**Calls run top to bottom. The same two calls in the other order paint a
different square.**

```ts
robot.paint();
robot.step();

robot.step();
robot.paint();
```

## For Racket hands

- `robot.paint();` is `(paint robot)`.
- The `;` ends one instruction, the way a closing bracket does in Racket.
