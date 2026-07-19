# Todo

State as of 2026-07-19. Lessons 01 to 04 are written and green under the gate. Lesson 05,
walk to the wall, is next.

## Where everything lives

- refs/curriculum-overview.md: the arc. Three acts (Painter lessons 1-10, Pig interleaved as
  lessons P1/P2, arpeggio capstone in the family repo), twelve lessons, one sequence for
  both kids.
- refs/painter-world.md: the teaching world, its types, the ten-rung ladder, harness
  boundary, per-kid notes (Bong: one semester Racket; JJ: 13, beginner).
- refs/curriculum-structure.md: lesson anatomy, with lessons/02-paint-the-l as the reference
  implementation -- linear lesson, worked example in the exercise file, card (150 words,
  three terms, code-led), wordbook, drills from lesson 03 on, capstone, word map.
- refs/serious-informatics-teaching.md: the ten principles behind all of it.
- refs/arpeggio-project.md: the capstone target in ~/gitfolders/arpeggio.

## Repo mechanics

- Each lesson is fully self-contained (own package.json, tsconfig, .stackblitzrc, harness
  under src/harness/) because StackBlitz serves the subtree alone:
  stackblitz.com/github/princengoc/teach-typescript/tree/main/lessons/NN-slug.
  StackBlitz re-imports from GitHub on every open; pushes are live on reload. Kid edits
  stay in their in-browser copy.
- Reference solutions in solutions/NN-slug/ mirror kid-edited files by relative path, with
  every `test.skip` in the drills unskipped.
- Root `npm test` runs scripts/verify-lessons.mjs: asserts each lesson's shipped starter is
  RED and its solution copy is GREEN, staged in a temp dir. `npm run check` = typecheck +
  biome + that.
- Each lesson tsconfig includes `src` only, on purpose: a fix-the-compiler drill has to fail
  tsc without failing the gate.
- Repo is public; no StackBlitz login needed.

## Lessons built

| Lesson | Rung | The kid writes | Card terms |
| --- | --- | --- | --- |
| 01 fix-the-start | values | five constants in src/exercise.ts | `const`, object, the dot |
| 02 paint-the-l | calling functions | a straight-line script of calls | call, brackets, execution order |
| 03 name-the-move | defining functions | the body of `paintShelf` | `function`, argument/parameter, `return` |
| 04 coin-flip-door | conditionals | the `else` in `faceTheRoom` | boolean, `if`, `else` |

Notes carried forward. Lesson 04 moved the harness boundary: the recording facade became a
live one, because a sensor answer depends on the room. The kid's code is now a function the
harness spends once per room, not a script that runs on import. Lesson 05 keeps that shape.

## Next

- [ ] Lesson 05 walk-to-the-wall: `while`, `let`, counter. Rung 5. The room's width is
      unknown, so a fixed count either crashes or stops short. `robot.wallAhead()` is the
      second sensor; the live facade from lesson 04 already supports it.
- [ ] Extract templates/lesson/ now that lessons 01 to 04 show what varies: index.html
      styles, markdown.ts, render.ts, types.ts, world.ts are copied near-verbatim; task.ts,
      exercise.ts, main.ts and the taught part differ per lesson.
- [ ] ideas.md: drill discoverability after lesson 01. Lessons 03 and 04 point at the
      drills from the post-PASS banner; lesson 01 still has no path to them.
- [ ] Consider a README line for kids: keep the tab open or fork to save progress.

## Waiting on the lead teacher, in a real browser

- [ ] Lesson 01. (a) menu shows, (b) demo Next walks still -> success -> failure -> Start
      Lesson 1, (c) Start Lesson 1 shows concepts then Build the room, (d) resizing grid
      resizes live, (e) door-on-goal shows blue praise then robot-on-door flips to green
      PASS with the lesson-02 pointer.
- [ ] Lesson 02. (a) the try-the-calls console advances one command per press and logs the
      call, (b) Paint the L replays the starter and reads "Good start: 2 of 5", (c)
      finishing the L turns the verdict green, shows the well-done banner and two PASS
      tiles from other doors, (d) the card renders.
- [ ] Lesson 03. (a) the four call buttons move the robot and log one line each, (b) "Teach
      the robot this move" clears the board and leaves two buttons, and one press of
      `paintShelf();` paints a whole shelf, (c) Paint the shelves replays the starter and
      reads "Each shelf starts further along than the last", (d) finishing paintShelf turns
      the verdict green with two PASS tiles, (e) the card renders and the drills pointer
      reads before it.
- [ ] Lesson 03, drill 02 the-broken-recipe: work it in StackBlitz and confirm the editor
      underlines all three errors.
- [ ] Lesson 04. (a) the two rooms draw with the door in opposite walls, (b) "Run this move
      in both rooms" animates both and captions them "door on the left: crash" and "door on
      the right: PASS", (c) `robot.wallOnLeft();` logs false for the left room and true for
      the right, (d) the build view's starter fails on the left door, (e) writing the else
      turns both tiles PASS and shows the well-done banner however the coin lands, (f) the
      card renders.
- [ ] Lesson 04, drill 02 the-broken-gate: confirm the editor underlines all three errors,
      and that the "lacks ending return statement" one reads clearly enough to act on.
