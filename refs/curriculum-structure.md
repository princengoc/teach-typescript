# Curriculum structure

Each lesson has three layers: a card, drills, and a capstone. The card names the new words.
The drills practice them in isolation. The capstone spends them on the world. A kid who
finishes a lesson can say what each new word means, has used it five times cheaply, and has
used it once on something with a picture.

## The layers

```
lessons/NN-slug/
  card.md      -- the language card
  drills/      -- small pure functions, each with failing tests
  capstone/    -- the rung in the teaching world
```

### The worked example

The teaching text lives in the code file the kid has open, not in prose about it. The top of
`src/exercise.ts` is a worked example, read before the drills, with each step preceded by a
comment naming its purpose -- "Step 1: name each number" -- never paraphrasing the line.
Subgoal-labeled worked examples are the best-evidenced move in programming instruction
(Margulieux et al.: better transfer, half the failure rate), and putting the explanation
beside the code is what the split-attention research demands. The exercise below mirrors the
worked example's steps, the kid filling in the last one. Test names read as the same kind of
label.

### The card

The card is a reference, not a lesson: it carries what code comments do badly. Two parts,
after Exercism's introduction/about split, and the card never restates what the worked
example's labels already say -- divided roles, no duplication.

The front is read before drilling and kept open beside the code. Hard limit 250 words plus
tables: one sentence saying what the lesson lets you build, then each new word as a bolded
term with its exact meaning in two or three sentences and a one-to-three-line example, rule
then instance, in one visual unit. Code snippets only to introduce new syntax. Terms spelled
so a kid can search them. No links.

The back is read after the capstone, limit 300 words: the deferred truth, one why, one thing
a later lesson will break. Never state what a later lesson must retract; defer explicitly
instead. Phrasing rule for bindings, the one all careful sources converge on: talk about
re-pointing the name, never about freezing the value. Register: plain prose a high schooler
parses on one tired read. No narrative framing, no filler, no epigrams -- write "you cannot
give the name a new value later", not "const locks the name, not the value". Concrete
subject, concrete verb, one idea per sentence.

### The wordbook and real documentation

Reading references is a taught skill. Two instruments:

1. Each lesson carries `wordbook.md`: every word the course has introduced so far, one line
   each, with the card that defines it. Copied forward and extended each lesson, since the
   StackBlitz subtree shows the kid only one lesson's folder. The wordbook is the kid's
   first API index; look there before asking.
2. From the first built-in on (Math in lesson 06, array methods in lesson 08), the card
   cites the exact MDN page, and one drill per such lesson is a doc-reading drill: use a
   function the course never taught, only documented. We do not write our own docs for the
   language; the kid learns to read the real ones, scaffolded by the wordbook habit.

Every card carries a two-column table, "this compiles / this does not," with the exact tsc
error text in the second column. The compiler co-teaches: strict tsc errors are legible, and
reading them is a skill. The table doubles as the answer key for provoke-error drills.

Cards that introduce something Racket has carry a short "For Racket hands" note drawing the
parallel: `function` is `define`, an if-else chain is `cond`, a Vitest case is `check-expect`,
an interface names the fields a struct would. Where TypeScript has what Racket lacks, the note
says so plainly: Racket loops by recursion, so `while` and `for` are new to everyone.

### The drills

Five to seven per lesson, the dose the many-small-programs studies validated. No world, no
canvas. Each drill is named for its story, not its concept. Test files skip all but the first
test, so the kid faces one red at a time. Test names read as specification: on a red run, the
test name is the error message.

The set runs in a fixed order, reading before writing:

1. Predict: given code using the new construct, the kid writes what it outputs. A two-minute
   win that trains tracing first.
2. Reorder or fix: a scrambled function to put in order (the first exposure to each control
   structure -- same learning as writing, half the time), or broken code to repair. One
   fix-drill per lesson fails tsc, not Vitest: reading the compiler is the exercise.
3. Implement: two or three tiny pure functions in near-isomorphic pairs -- `sumTo(n)`, then
   `sumEvensTo(n)` -- so the second rep is retrieval, not novelty.
4. Twist: a part-2 requirement on an earlier drill in the set, written so a hard-coded answer
   dies and the general solution wins. Or write-the-test: the function is given, the kid
   writes the missing cases.
5. Review: one drill using only earlier lessons' words. Interleaving costs now and pays at
   retention.

Each lesson keeps an overflow pool of two or three extra implement drills for whichever kid
needs more reps. Surplus is the point: not everyone drills the same amount.

Drills carry concepts the world cannot: `return` appears in drills at lesson 3, though the
robot's commands are all void. Drills are cheap repetition; the capstone judges on random
seeds, so a kid who drilled cannot thrash their way to green.

One drill on disk:

```
drills/DD-story-name/
  readme.md       -- one-sentence story, numbered tasks saying what, never how,
                     one usage example that is not a test case
  story-name.ts   -- stub; compiles under strict tsc; only prior-lesson syntax
  story-name.test.ts
  hints.md        -- per task, points at the card, never the solution
  .solution/      -- exemplar; excluded from the StackBlitz subtree
```

Each drill is tagged with format (predict, reorder, fix-compile, fix-runtime, implement,
write-test, provoke-error), difficulty 1 to 3, and which earlier concepts it reviews. Track
attempts-to-green and re-rank difficulty from data; author guesses are guesses.

### The capstone

The rung: a problem in the teaching world, judged red to green with a rendered picture. One
step harder than the last rung. The capstone uses only words from this lesson's card and
earlier cards.

## Rules

1. Every word is introduced at first need, never in advance. No vocabulary tour.
2. One concept per lesson. A lesson may introduce zero new words: consolidation is a lesson.
3. The kid explains the solution aloud after green. Prediction before execution: say what the
   picture will show before pressing run.
4. Drills before capstone, always. Five cheap uses before one expensive one.
5. Cards accumulate: the kid's own cards become their language reference.

## Word introduction map

The teaching world is Painter, a robot in a walled room (see the design ladder). Rungs are
capstones; drills and cards flank them.

| Lesson | Capstone rung | New words | Sample drills |
| --- | --- | --- | --- |
| 1 | Fix the start | statement, `const`, number literal, `.` access | edit constants to satisfy tests; provoke the reassignment error |
| 2 | Paint the L | function call, argument, execution order, `;` | call provided functions in order |
| 3 | Name the move | `function`, parameter, `return`, `number`, `void` | `double(n)`, `add(a, b)`, `greet(name)` |
| 4 | Coin-flip door | `boolean`, `if`/`else`, `===`, `<`, `>`, `!` | `isEven`, `sign(n)`, `maxOf(a, b)` |
| 5 | Walk to the wall | `while`, `let`, counter, accumulator | count down with while, `sumTo(n)` |
| 6 | Paint a row | `for`, `i++`, fencepost | count backwards, `repeat(s, n)`, times table |
| 7 | The border | none: consolidation | mixed review |
| 8 | Read the board | array, `[]`, `.length`, `interface` | `sumArray`, `countMatching`, `largest` |
| 9 | Measure the claim | `boolean[]`, tallies | `countTrue`, `mean` |
| 10 | Write the machine | `type`, union, `switch`, literal types | classify a small union |

Notes on placement. `interface` waits until lesson 8: kids read structured state from lesson 1,
and the word arrives when it names a thing they already know. `let` waits until lesson 5 so
mutation feels like the event it is. `return` enters through drills before the world needs it.
Lesson 7 introduces nothing on purpose.

## Outside practice

Send the kids to Exercism's TypeScript track for extra drills, once the concepts there are
covered by their cards. Outside practice buys an independent judge, unlimited repetition, and a
calibration check: a kid who clears our lesson but stalls on the matching Exercism exercises
has found a gap in our ladder. Never send them ahead of the cards.

Ladders are destinations, not drills: the competitive sets (CSES, Codeforces, Kattis) start
above first-loop level. Exceptions and graduations: Project Euler problems 1 to 6 fit right
after the for lesson; the CSES introductory section is JJ's graduation set at the end of the
course.

## Pacing

Both kids take the same lessons in the same order; nothing is optional for either. Speed may
differ; the sequence does not. JJ gets extra capstone variants at lessons 1 to 3 and the
overflow drill pool when a concept needs more reps. Bong reads the "For Racket hands" notes,
writes expected output into tests before code (the design recipe's examples step), and will
find lessons 5 and 6 as new as JJ does: Racket loops by recursion, and `while` and `for` are
her first loops too.
