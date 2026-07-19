# Curriculum structure

`lessons/02-paint-the-l/` is the reference implementation. Copy its shape. Lesson 01 came
first and carries a menu and a demo walkthrough that later lessons do not need; take the
card and the exercise from it, not the navigation.

## The lesson

Linear: a short taught part, then the build, then the card. The kid edits `src/exercise.ts`
and nothing else. The preview is the judge -- they save, it re-renders, a verdict reads
`PASS` or `FAIL`. They never open a terminal.

The taught part shows rather than tells. Lesson 02's is a live console: three buttons, one
command per press, the presses piling into a visible list that is recognisably a program.
Prose is the fallback, not the first choice.

On `PASS`: a well-done banner, then the card, then a pointer to the next lesson.

## The worked example

The teaching text lives in the file the kid has open. The top of `src/exercise.ts` is a
worked example with each step preceded by a comment naming its purpose -- "Step 1: paint the
square the robot is standing on" -- never paraphrasing the line. The kid finishes the last
steps. Test names read as the same kind of label.

## The card

A recap, read after the build. **Hard limit 150 words and three terms.** One sentence saying
what the kid built, then each term as a bolded one-line claim followed by the code block that
shows it. The code carries the weight; the prose points at it. A term the kid did not just
use does not go on the card. Cards 01 and 02 are the format.

Off the card: error tables, "coming later" sections, and anything the worked example's
comments already said. Error text belongs where the kid meets the error -- the fix-compile
drills and the preview verdict.

Phrasing rule for bindings: talk about re-pointing the name, never about freezing the value.
Write "you cannot give the name a new value later", not "const locks the name, not the
value". Concrete subject, concrete verb, one idea per sentence. No links.

Cards that introduce something Racket has carry a two-line "For Racket hands" note:
`function` is `define`, an if-else chain is `cond`, a Vitest case is `check-expect`. Where
TypeScript has what Racket lacks, say so: Racket loops by recursion, so `while` and `for` are
new to everyone.

## The wordbook

Each lesson carries `wordbook.md`: every word the course has introduced so far, one line
each, with the card that defines it. Copied forward and extended each lesson, since the
StackBlitz subtree shows the kid only one lesson's folder. It lists what the cards define and
nothing more. The wordbook is the kid's first API index; look there before asking.

From the first built-in on (Math in lesson 06, array methods in lesson 08), the card cites the
exact MDN page and one drill uses a function the course never taught, only documented. We do
not write our own docs for the language.

## The drills

None in lessons 01 and 02: before `return` and real pure functions exist, a drill degenerates
into "read the file, write the number over here". There the capstone is the drill.

From lesson 03, five to seven per lesson. No world, no canvas. Each drill is named for its
story, not its concept. Test files skip all but the first test, so the kid faces one red at a
time. Any drill a kid can clear without thinking is cut, at any lesson.

The set runs in a fixed order, reading before writing:

1. **Predict:** given code, the kid writes what it outputs. Trains tracing first.
2. **Reorder or fix:** a scrambled function to put in order, or broken code to repair. One
   fix-drill per lesson fails tsc, not Vitest: reading the compiler is the exercise.
3. **Implement:** two or three tiny pure functions in near-isomorphic pairs -- `sumTo(n)`,
   then `sumEvensTo(n)` -- so the second rep is retrieval, not novelty.
4. **Twist:** a part-2 requirement written so a hard-coded answer dies. Or write-the-test.
5. **Review:** one drill using only earlier lessons' words.

Each lesson keeps an overflow pool of two or three extra implement drills. Surplus is the
point: not everyone drills the same amount. Drills carry concepts the world cannot -- `return`
appears at lesson 03 though the robot's commands are all void.

```
drills/DD-story-name/
  readme.md       -- one-sentence story, numbered tasks saying what, never how
  story-name.ts   -- stub; compiles under strict tsc; only prior-lesson syntax
  story-name.test.ts
  hints.md        -- per task, points at the card, never the solution
  .solution/      -- exemplar; excluded from the StackBlitz subtree
```

## The capstone

A problem in the teaching world, judged red to green with a rendered picture. One step harder
than the last rung. Uses only words from this lesson's card and earlier cards.

## Rules

1. Every word is introduced at first need, never in advance. No vocabulary tour.
2. One concept per lesson. A lesson may introduce zero new words: consolidation is a lesson.
3. The kid explains the solution aloud after green, and says what the picture will show
   before pressing run.
4. Any exercise a kid can clear without thinking is cut.
5. Cards accumulate: the kid's own cards become their language reference.

## Word introduction map

| Lesson | Capstone rung | New words |
| --- | --- | --- |
| 1 | Fix the start | `const`, object, the dot |
| 2 | Paint the L | call, brackets, execution order |
| 3 | Name the move | `function`, parameter, argument, `return` |
| 4 | Coin-flip door | `boolean`, `if`/`else`, `===`, `<`, `>`, `!` |
| 5 | Walk to the wall | `while`, `let`, counter |
| 6 | Paint a row | `for`, `i++`, fencepost |
| 7 | The border | none: consolidation |
| 8 | Read the board | array, `[]`, `.length`, `interface` |
| 9 | Measure the claim | `boolean[]`, tallies |
| 10 | Write the machine | `type`, union, `switch`, literal types |

Placement notes. `interface` waits until lesson 08: kids read structured state from lesson 01,
and the word arrives when it names a thing they already know. `let` waits until lesson 05 so
mutation feels like the event it is. `argument` waits until lesson 03, where `parameter`
explains it; no lesson-02 call takes one. Lesson 07 introduces nothing on purpose.

## Outside practice

Exercism's TypeScript track, once the concepts there are covered by their cards. It buys an
independent judge and a calibration check: a kid who clears our lesson but stalls on the
matching Exercism exercises has found a gap in our ladder. Never send them ahead of the cards.

Ladders are destinations, not drills: CSES, Codeforces and Kattis start above first-loop
level. Project Euler 1 to 6 fit right after the for lesson; the CSES introductory section is
JJ's graduation set at the end of the course.

## Pacing

Both kids take the same lessons in the same order. Speed may differ; the sequence does not.
JJ gets extra capstone variants at lessons 01 to 03 and the overflow drills. Bong reads the
"For Racket hands" notes and writes expected output into tests before code. Lessons 05 and 06
are as new to her as to JJ: Racket loops by recursion.
