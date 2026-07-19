---
name: design-lesson
description: Plan a single TypeScript lesson as Goal / Objective / Done-when, then deliver a red-to-green exercise plus a rendering preview, each criterion marked PASS or FAIL. Use whenever the lead teacher frames work as designing, building, or verifying a lesson.
---

# Lesson-design harness

The lead teacher sets the criteria. You deliver a lesson whose failing test the kid turns green
and whose preview renders. The lead teacher checks criteria, not code.

## The shape, set by lesson 01

Every lesson keeps this shape unless the lead teacher says otherwise.

- **Linear.** One path, no menu of choices mid-lesson: a short taught part, then the build.
  The preview is hash-routed so a save-reload returns the kid to the view they were on.
- **One file.** The kid edits `src/exercise.ts` and nothing else. Everything else is harness.
- **The preview is the judge.** The kid never opens a terminal. They save, the Vite preview
  re-renders, and a verdict reads `PASS` or `FAIL`. The Vitest spec is the author's judge;
  both call the same pure function, so they cannot disagree.
- **Encouraging.** A visible well-done banner on PASS, and a pointer to what comes next.
- **The card is a recap, and it is short.** It renders in the preview after the build, not
  before. Hard limit 150 words and three terms: one bolded one-line claim per term, each
  followed by the code block that shows it. The code carries the weight. No error tables, no
  "coming later" section, nothing the kid did not just use. `card.md` stays the one place
  those words live. `lessons/02-paint-the-l/card.md` is the format.
- **No mindless drills.** A drill that is "read the file, write the number over here" is not
  work. Cut it. Extra reps must demand something the capstone did not.

## Phase 1 -- Plan

Author the plan (in plan mode) as Goal / Objective / Done-when and nothing else.

- **Goal**: the one concept this lesson teaches. One concept, not two.
- **Objective**: what the kid can write unaided after the lesson.
- **Done-when**: each bullet maps to a pass/fail check -- the red test that must go green, the
  preview feature that must render, the syntax that must not appear because the lesson has not
  taught it yet. Cut vague bullets before showing the plan.

The lead teacher edits the done-when list; the edited list is the spec. Flag any bullet you
cannot verify before building.

## Phase 2 -- Build and verify

A lesson is a self-contained workspace under `lessons/NN-slug/`:

- `src/exercise.ts` -- the starter, intentionally failing. The only file the kid edits.
- `src/exercise.test.ts` -- the Vitest spec that encodes done.
- `src/main.ts` -- the preview: the taught part, the build, the card, hash-routed.
- `src/harness/` -- world, judge, renderer, markdown. Carries its own unit tests.
- `card.md` -- the recap, rendered by the preview.
- `wordbook.md` -- every word so far, copied forward from the last lesson and extended.
- `README.md` -- the student brief: one concept, the task, how to know it is done.
- `solutions/NN-slug/` -- reference solution at the repo root, mirroring kid-edited files by
  relative path. Outside the served subtree so the kid cannot peek.

Test pure functions, not pixels; let the preview do the drawing.

Verify before hand-back:

- `npm run check` at the repo root is clean. It typechecks, runs biome, and runs
  `scripts/verify-lessons.mjs`, which asserts the shipped starter is RED and the solution
  copy is GREEN in a temp dir. This is the gate, not per-lesson `npm test`.
- Preview renders the stated feature and its verdict flips to `PASS` on the solution.
- `wordbook.md` carries this lesson's new words.

## Hand-back

Name each done-when bullet and its verdict. Do not re-explain the code. If any criterion is
FAIL, say so and say why.
