# teach-typescript

A TypeScript curriculum that teaches kids just enough to write a real for loop inside a game.

This repo is the authoring workspace: the lead teacher and Claude design and test lessons here.
The kid never opens it. A kid opens a StackBlitz web IDE link, turns a failing test green, and
watches the preview render.

## Getting started

```
direnv allow          # or: nix develop
npm install
npm run check         # typecheck, lint, test
```

## Authoring a lesson

Invoke `/design-lesson`. It frames a lesson as Goal / Objective / Done-when, then builds a
red-to-green exercise plus a rendering preview, each criterion marked PASS or FAIL.

## Layout

```
lessons/NN-slug/   one self-contained Vite + Vitest lesson (built later)
scripts/           repo tooling (typecheck fan-out)
.claude/           harness: skill, settings, lint hook
CLAUDE.md          working protocol, stack, code and writing style
todolist.md        what to build next
```

Stack and standards live in `CLAUDE.md`. They are settled; build on them.
