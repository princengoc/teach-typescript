# Card 03: naming a move

You wrote one move, gave it a name, and spent the name three times.

**A function gives a list of calls one name. Writing the function runs
nothing. Calling the name is what runs it.**

```ts
function paintShelf(): void {
  robot.paint();
  robot.walk(1);
  robot.paint();
}

paintShelf();
paintShelf();
```

**An argument is a value you hand to a call. Inside, it arrives under the
name in the brackets: the parameter.**

```ts
robot.walk(2);

function double(n: number): number {
  return n * 2;
}

double(5);
```

**`return` hands a value back to whoever called. The call then stands for
that value.**

```ts
const eight = double(4);
```

## For Racket hands

- `function` is `define`.
- Racket hands back the last expression on its own. TypeScript waits to be
  told, with `return`.
