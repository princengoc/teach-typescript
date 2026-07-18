# Todo

Curriculum is designed (see refs/). Lesson 01 is built. Work top to bottom.

## Done

- [x] Curriculum designed: refs/curriculum-overview.md (three acts, twelve lessons),
      refs/painter-world.md (the world and ladder), refs/curriculum-structure.md (card,
      drills, capstone), refs/serious-informatics-teaching.md (principles),
      refs/arpeggio-project.md (the capstone target).
- [x] Lesson infrastructure, built with lesson 01: self-contained lesson workspace (own
      package.json, tsconfig, .stackblitzrc; no extends above the folder, so the StackBlitz
      subtree serves alone), harness under src/harness/, solutions under solutions/NN-slug/
      mirroring kid-edited files, scripts/verify-lessons.mjs (root npm test asserts starter
      RED and solution GREEN per lesson).
- [x] Lesson 01 fix-the-start: card, four drills plus overflow, capstone, preview. Verified:
      starter RED, solution GREEN, npm run check clean, standalone install/test/build clean.

## Next

- [ ] Lead teacher: open the StackBlitz link in lesson 01's README and confirm it boots and
      the preview renders (no local browser here; this is the one manual check).
- [ ] Extract `templates/lesson/` from lesson 01 once lesson 02 shows what varies.
- [ ] Lesson 02 paint-the-L via /design-lesson: calling functions; the recording facade
      enters the harness.
