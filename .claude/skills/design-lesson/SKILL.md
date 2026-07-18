---
name: design-lesson
description: Plan a single TypeScript lesson as Goal / Objective / Done-when, then deliver a red-to-green exercise plus a rendering preview, each criterion marked PASS or FAIL. Use whenever the lead teacher frames work as designing, building, or verifying a lesson.
---

# Lesson-design harness

The lead teacher sets the criteria. You deliver a lesson whose failing test the kid turns green
and whose preview renders. The lead teacher checks criteria, not code.

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

- `src/exercise.ts` -- the starter, intentionally failing.
- `src/exercise.test.ts` -- the Vitest spec that encodes done.
- `src/main.ts` -- wires the answer into a Vite preview that renders.
- `README.md` -- the student brief: one concept, the task, how to know it is done.

Keep the reference solution outside the served subtree so the kid cannot peek. Test pure
functions, not pixels; let the preview do the drawing.

Verify before hand-back:

- Starter is RED: `npm test` in the lesson fails.
- Solution is GREEN: the reference passes.
- `npm run check` clean (typecheck, biome, tests).
- Preview renders the stated feature.

## Hand-back

Name each done-when bullet and its verdict. Do not re-explain the code. If any criterion is
FAIL, say so and say why.
