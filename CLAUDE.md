# Working protocol

You are the **assistant**, the user is the **lead teacher**. Together we design and test a
TypeScript curriculum that teaches kids just enough to write a real for loop inside a game.

Non-trivial lesson work starts as a plan. Use `/design-lesson`: it frames a lesson as
Goal / Objective / Done-when and delivers a red-to-green exercise plus a rendering preview, each
criterion marked PASS or FAIL. The lead teacher edits the done-when list; that list is the spec.
The lead teacher checks criteria, not code.

The kid never opens this repo and never talks to a bot. They open a StackBlitz web IDE link,
turn a failing test green, and watch the preview render. This repo serves the authoring side.

## Drafts

Draft straight into the file it belongs in; never leave a draft only in chat. The lead teacher
reviews the diff and edits the file. Do not make separate draft files. Plan mode is for plans that
need approval, not a place to park text.

## The kit

Every lesson tells the kid what it hands them, and the harness is the only source of it.
`npm run kit` reads each lesson's `src/harness/moves.ts` exports, its `robot` methods, and its
`Room` fields, each with the `//` line above it, and writes two derived things: `kit.md`, which
the preview renders behind the **Your kit** button, and the block between the `--- your kit ---`
markers at the top of `src/exercise.ts`. Edit neither by hand. Fix the comment in the harness and
run `npm run kit`; `npm run check` fails while either is stale.

A kit is what its own lesson hands over, not everything the course has introduced. `Room` changes
shape lesson to lesson, and the robot appears only where the exercise imports it. A one-line
comment above every kid-facing move, robot method and `Room` field is required, because that line
is the documentation.

The kit reads as one growing thing, so the generator reads all twelve lessons and marks every
entry `new here`, `since lesson NN`, `back from lesson NN`, `just this room`, or
`you write it here`. Two rules keep those marks honest. A move that comes back keeps its name and
its wording: one move, one name, course-wide -- rename it in one lesson and the kid meets a
stranger. A move that only ever serves one room is fine, and the mark says so; what is not fine is
the same move under three names, which is what `goToNextBar`, `stepToNextBar` and `toNextBarFoot`
were before they became `toNextBar`.

## Stack

| Concern | Choice |
| --- | --- |
| Toolchain | Node 22, npm |
| Build and preview | Vite, vanilla TypeScript |
| Tests | Vitest |
| Lint and format | Biome |
| Typecheck | tsc, strict |
| Repo shape | npm-workspaces monorepo; each `lessons/NN-slug/` self-contained |
| Serving | StackBlitz GitHub subtree import |

Node, not Deno: StackBlitz runs WebContainers, so local equals served. Vanilla TypeScript, not
React: a for loop drawing to a canvas needs no framework. Settled; build on them.

## Coding style

Senior-engineer minimal, Google TypeScript Style Guide. Strict `tsc`, Biome clean, no
suppressions. Small functions over cleverness. Type public functions. No comments except where
intent is non-obvious. Two-space indent, single quotes, semicolons.

Lesson code the kid reads is held higher: one concept per lesson, names a ten-year-old can read,
no syntax the lesson has not introduced.

Scaffolding shrinks as the course goes on. Each lesson hands the kid less finished code and asks
for more of their own than the one before. Early on the kid fills in a value or a single line; by
the end the kid writes a whole function. Never scaffold a later lesson more heavily than an earlier
one. Lesson 05 asks for more than lesson 04: the kid declares the `let`, writes the reassignment,
and repeats the move by hand, so lesson 06's `for` folds up code the kid wrote, not code we gave.

## Writing style

Strunk & White: omit needless words, active voice, concrete over abstract, one idea per
sentence. No emojis anywhere -- prose, code, commits. Verdicts read `PASS`/`FAIL`, not marks.
