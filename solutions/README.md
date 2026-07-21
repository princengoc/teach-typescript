# Solutions

Two things live under `solutions/`.

The **mirror** -- `solutions/NN-slug/`, file for file against the lesson -- is the answer
key. It holds the kid-edited files finished, every drill `test.skip` unskipped, green under
`npm run check`. Use it to confirm a lesson can be solved and to diff against a stuck kid.

This **deck** is the other thing. For the lessons where there is craft to argue about, it
shows how a pro writes the answer and, when the concepts so far allow more than one honest
way, both. Nothing here uses a tool the lesson has not handed the kid yet.

Not every lesson earns a slide. Some have one honest answer and nothing to say about it.

- **01 fix the start** -- pick the two numbers so the start sits on the door. One answer.
  In the mirror.
- **02 paint the L** -- five calls in the one order the shape allows. There is no function
  yet to fold the repeat into; that is exactly what lesson 03 is for. One answer, in the
  mirror. Notice the repeated `paint` / `step` and hold it.
- **04 the coin-flip door** -- one slide below, but only to say why it stays one line each way.

Slides: **03**, **04**, **05**, **06**.

---

## 03 -- name the move

The graded part is `paintShelf`. Painting the three squares is the easy half:

```ts
robot.paint();
robot.walk(1);
robot.paint();
robot.walk(1);
robot.paint();
```

The half that separates a working move from a reusable one is step 4: **leave the robot
where you found it.** After painting, the robot stands two squares along, still facing down
the shelf. `goToNextShelf` is written assuming the robot comes back home first. So turn
around, walk the two squares back, turn around again:

```ts
robot.turnLeft();
robot.turnLeft();
robot.walk(2);
robot.turnLeft();
robot.turnLeft();
```

**The other honest way.** "Turn around" is two turns the *same* direction -- and it does not
matter which. Two rights read the same as two lefts:

```ts
robot.turnRight();
robot.turnRight();
robot.walk(2);
robot.turnRight();
robot.turnRight();
```

Same robot, same square, same facing. That they are interchangeable is the point: a
half-turn has no handedness.

**How a pro writes it.** "Turn around" wants its own name. The kid already has functions;
spend one here:

```ts
function turnAround(): void {
  robot.turnLeft();
  robot.turnLeft();
}

function paintShelf(): void {
  robot.paint();
  robot.walk(1);
  robot.paint();
  robot.walk(1);
  robot.paint();
  turnAround();
  robot.walk(2);
  turnAround();
}
```

Now `paintShelf` reads as what it does: paint the three, then come home. A move you can
spend again is a move that leaves the room as it found it.

---

## 04 -- the coin-flip door

One decision, one line each way:

```ts
function faceTheRoom(): void {
  if (robot.wallOnLeft()) {
    robot.turnRight();
  } else {
    robot.turnLeft();
  }
}
```

There is no shorter honest version with the concepts so far, and no reason to want one. The
two branches are mirror images, so read the sensor **once** and turn **once** on the answer.
The trap is to ask twice -- an `if` that turns right, then a second `if` that turns left --
which reads the coin-flip door as two questions when it is one.

---

## 05 -- the staircase

The whole lesson is the first two words the kid changes: `const` becomes `let`. A staircase
is one number that grows, and a `const` cannot grow.

```ts
export function paintStaircase(): void {
  let height = robot.startHeight();
  paintBar(height);
  goToNextBar();
  height += 1;
  paintBar(height);
  goToNextBar();
  height += 1;
  paintBar(height);
}
```

**The other honest way.** `height += 1` is shorthand. Spelled out, it is the same move --
read the value, add one, put it back under the same name:

```ts
height = height + 1;
```

Worth writing out once so the shorthand is not magic: `+=` is "add to what is there," not a
new kind of thing.

**How a pro reads it.** Three bars, and the code says `paintBar` three times. That is fine
for three. But `height += 1; paintBar(height); goToNextBar();` is a rung repeated by hand --
a start value, a step, a body run again. Lesson 06 folds exactly this shape into a `for`
loop. This is the last lesson where the repeat is written out; see it as a loop waiting to
happen.

---

## 06 -- the loop

The payoff lesson. Every figure is a repeat, and the deck's job is to show that the same
figure has more than one honest shape.

**Square and rectangle -- a `for` loop counts the sides.**

```ts
export function paintSquare(): void {
  const side = robot.squareSide();
  for (let i = 0; i < 4; i += 1) {
    paintSide(side);
  }
}

export function paintRectangle(): void {
  const width = robot.rectWidth();
  const height = robot.rectHeight();
  for (let i = 0; i < 2; i += 1) {
    paintSide(width);
    paintSide(height);
  }
}
```

A rectangle is not four sides, it is a long-and-short pair, twice. Reading the shape before
writing the loop is the whole skill: the loop count is how many times the *pattern* repeats,
not how many sides there are.

**The staircase -- two honest ways.** The `for` loop carries the growing height in a `let`,
exactly the lesson-05 counter now living inside the loop:

```ts
export function paintStaircaseLoop(): void {
  const barCount = robot.barCount();
  let height = 1;
  for (let i = 0; i < barCount; i += 1) {
    paintBar(height);
    stepToNextBar();
    height += 1;
  }
}
```

Recursion carries the height instead as a number handed to the next copy -- no `let`, because
nothing changes in place; each call just gets bigger numbers:

```ts
function climb(height: number, barsLeft: number): void {
  if (barsLeft === 0) return;
  paintBar(height);
  stepToNextBar();
  climb(height + 1, barsLeft - 1);
}

export function paintStaircaseRec(): void {
  climb(1, robot.barCount());
}
```

Same staircase. The `for` loop keeps a counter that changes; the recursion keeps no counter
and hands new numbers down. Neither is the "real" one -- they are two ways to say "again."

**The blind square -- when you do not know how many.** The loop and the recursion above both
need a count up front. Rung 5 hides it: the side is a `?`, a new size every run. The count
you cannot get, but the robot can *feel* the end -- `robot.wallAhead()` is true when the next
step lands on a wall. So the base case is a sensor, not a number:

```ts
function paintLine(): void {
  robot.paint();
  if (robot.wallAhead()) return;
  robot.walk(1);
  paintLine();
}

export function paintSquareBlind(): void {
  for (let i = 0; i < 4; i += 1) {
    paintLine();
    robot.turnRight();
  }
}
```

Four sides is still a known count, so that stays a `for` loop. But the *length* of each side
is unknown, so `paintLine` recurses until it feels the wall. This is the arc's last idea:
the thing that ends a repeat need not be a number you counted out -- it can be a wall the
robot only meets when it gets there.
