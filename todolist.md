# Todo

State as of 2026-07-19. The curriculum is designed, lesson 01 is built and pushed, and the
lead teacher wants lesson 01 refined further before building lesson 02.

## Where everything lives

- refs/curriculum-overview.md: the arc. Three acts (Painter lessons 1-10, Pig interleaved as
  lessons P1/P2, arpeggio capstone in the family repo), twelve lessons, one sequence for
  both kids.
- refs/painter-world.md: the teaching world, its types, the ten-rung ladder, harness
  boundary, per-kid notes (Bong: one semester Racket; JJ: 13, beginner).
- refs/curriculum-structure.md: lesson anatomy -- worked example in the exercise file
  (subgoal-labeled), card (front/back, plain prose, compiles/does-not table, For Racket
  hands), drills (5-7, fixed format order: predict, reorder or fix, implement, twist,
  review), capstone, wordbook, doc-reading policy (MDN from lesson 06 on).
- refs/serious-informatics-teaching.md: the ten principles behind all of it.
- refs/arpeggio-project.md: the capstone target in ~/gitfolders/arpeggio.

## Repo mechanics

- Each lesson is fully self-contained (own package.json, tsconfig, .stackblitzrc, harness
  under src/harness/) because StackBlitz serves the subtree alone:
  stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/NN-slug.
  StackBlitz re-imports from GitHub on every open; pushes are live on reload. Kid edits
  stay in their in-browser copy.
- Reference solutions in solutions/NN-slug/ mirror kid-edited files by relative path.
- Root `npm test` runs scripts/verify-lessons.mjs: asserts each lesson's shipped starter is
  RED and its solution copy is GREEN, staged in a temp dir. `npm run check` = typecheck +
  biome + that.
- Repo is public; no StackBlitz login needed.

## Done

- [x] Curriculum designed and written to refs/ (research-backed; sources cited in refs).
- [x] Lesson 01 fix-the-start: worked example + YOUR TURN in src/exercise.ts, card.md
      (plain prose), wordbook.md, four drills plus overflow, canvas preview with replay and
      PASS/FAIL verdict, solutions, all green under npm run check.

## Next

- [ ] Refine lesson 01 further with the lead teacher (their explicit next intent).
  - [x] Entry UX: preview page now carries the game premise, the one task, a
        legend, and a big live PASS/FAIL verdict. README stripped to a pointer;
        StackBlitz link opens on src/exercise.ts (?file=). Feedback loop for
        lesson 01 is preview-only -- no terminal, no npm test for the kid.
  - [ ] Lead teacher: open the link in a real browser and confirm the preview
        reads as the obvious call-to-action.
- [ ] Lead teacher: confirm the StackBlitz link boots and the preview renders in a browser
      (never verified in a real browser; no browser in the dev environment).
- [ ] Consider a README line for kids: keep the tab open or fork to save progress.
- [ ] Extract templates/lesson/ once lesson 02 shows what varies.
- [ ] Lesson 02 paint-the-L via /design-lesson: calling functions; recording facade enters
      the harness.
