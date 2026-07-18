# Painter: the teaching world

A robot in a walled room paints cells to match a target pattern. KuMir lineage: an executor
in a formal world, before variables. The kid drives the robot, then reads its world, then
reimplements its rules. The harness owns rendering, replay, and the judge throughout.

## The world

```ts
type Direction = 'north' | 'east' | 'south' | 'west';

interface Robot {
  x: number;
  y: number;
  facing: Direction;
}

interface World {
  width: number;
  height: number;
  blocked: boolean[][];
  painted: boolean[][];
  robot: Robot;
  crashed: boolean;
}

type Command =
  | { kind: 'step' }
  | { kind: 'turn'; hand: 'left' | 'right' }
  | { kind: 'paint' };

interface Task {
  start: World;
  targetPainted: boolean[][];
  goal?: { x: number; y: number };
}
```

Rules are three pure functions, one source of truth:

```ts
function step(world: World, command: Command): World;   // total: bad step sets crashed
function run(world: World, commands: Command[]): World; // folds step; caps at 500 commands
function solved(world: World, task: Task): boolean;     // machine-checkable win
```

Early lessons use a recording facade so beginners write commands, not data: `robot.step()`,
`robot.turnLeft()`, `robot.paint()`, and boolean sensors `robot.wallAhead()`,
`robot.onPaint()`. Every call records a `Command`; the animator replays the list; the judge
checks `run`'s final world.

Win: `painted` equals `targetPainted`, robot on `goal` when one exists, no crash. The canvas
shows the target as a ghost outline, painted cells solid, the robot as a facing triangle;
replay animates the commands; a crash freezes with a red flash. A wrong function draws a
wrong picture.

## Randomness forces control flow

Rooms are built by seeded RNG: random door side, random width, random start. Tests fix seeds,
so red-to-green stays deterministic; the preview seeds from the clock, so every reload is a
new room. In a deterministic world a straight-line script always suffices; here a coin-flip
door makes `if` the only answer and a random width makes `while` the only answer. A script
that passes all seeds is a total function, learned from a robot instead of a lecture.

## The ladder

Rungs are lesson capstones. Cards and drills flank them (see curriculum-structure.md).

| Rung | Task | Concept | Wrong picture |
| --- | --- | --- | --- |
| 1 | Fix the start: edit two constants | values | robot begins far from the door ghost |
| 2 | Paint the L: straight-line script | calling functions | trail departs the ghost; crash flash |
| 3 | Name the move: `paintShelf()` three times | defining functions | one bug repeats three times |
| 4 | Coin-flip door: first `if`/`else` on a sensor | conditionals | crashes on half the seeds |
| 5 | Walk to the wall: `while (!robot.wallAhead())` | while | fixed counts crash or stop short |
| 6 | `paintRow(len)` with a for loop | for | gap (under-paint) or crash (over-step) |
| 7 | The border: loop, negation, sensors composed | consolidation | unclosed seam; orbit until cap |
| 8 | Read the board: `totalPainted(world)` | arrays | printed count beside the visible count |
| 9 | Measure the claim: walker survives 100 rooms | simulation | strip of green and red tiles |
| 10a | Write the machine: reimplement `step` | union, switch, totality | every replay goes wrong |
| 10b | Blind navigator: `nextCommand(robot)` per tick | policy function | judged over 100 rooms |

The harness-kid boundary never moves backward. The kid's surface per rung: two literals (1),
a script (2), a function (3), one conditional (4), one while (5), `paintRow` (6), the border
walker (7), two read functions (8), `countTrue` plus the claim test (9), `step` (10a),
`nextCommand` (10b). Everything else ships.

## The two kids

Both kids climb every rung in the same order. JJ (13, beginner) gets sibling capstone
variants at rungs 1 to 3 and the overflow drills. Bong (11, one semester Racket) gets the
"For Racket hands" card notes and writes expected grids into tests before code; the loop
rungs are as new to her as to JJ. At 10a each kid's `step` replaces the harness's in their
own copy, so a wrong rule visibly breaks every earlier replay.

Tasks are data, so each kid can author a target pattern as a challenge for the other.
