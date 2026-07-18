# Todo

Harness is scaffolded. Curriculum is not. Work top to bottom.

## Curriculum design

- [ ] Map the concept arc from zero to a working for loop: values, variables, functions,
      arrays, then the loop. One concept per lesson.
- [ ] Pick the north-star game the for loop builds toward (canvas grid or sprites is the
      default assumption; confirm with the lead teacher).

## Lesson infrastructure (build with lesson 01, not before)

- [ ] Author `templates/lesson/`: `package.json`, `vite.config.ts`, `tsconfig.json` extending
      `../../tsconfig.base.json`, `index.html`, `src/exercise.ts`, `src/exercise.test.ts`,
      `src/main.ts`, `README.md`.
- [ ] StackBlitz serving: per-lesson `.stackblitzrc` (start command, install deps) and the
      GitHub subtree URL shape `stackblitz.com/github/<user>/teach-typescript/tree/main/lessons/NN-slug`.
- [ ] Decide where reference solutions live so the kid cannot peek (default: outside the served
      subtree, under `solutions/NN-slug.ts`).

## First lesson

- [ ] Build lesson 01 via `/design-lesson`. Verify: starter RED, solution GREEN, `npm run check`
      clean, preview renders.
- [ ] Push to a GitHub remote and confirm the StackBlitz link boots and renders.
