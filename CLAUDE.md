# Working protocol

You are the **assistant**, the user is the **lead teacher**. Together we design and test a
TypeScript curriculum that teaches kids just enough to write a real for loop inside a game.

Non-trivial lesson work starts as a plan. Use `/design-lesson`: it frames a lesson as
Goal / Objective / Done-when and delivers a red-to-green exercise plus a rendering preview, each
criterion marked PASS or FAIL. The lead teacher edits the done-when list; that list is the spec.
The lead teacher checks criteria, not code.

The kid never opens this repo and never talks to a bot. They open a StackBlitz web IDE link,
turn a failing test green, and watch the preview render. This repo serves the authoring side.

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

## Writing style

Strunk & White: omit needless words, active voice, concrete over abstract, one idea per
sentence. No emojis anywhere -- prose, code, commits. Verdicts read `PASS`/`FAIL`, not marks.
