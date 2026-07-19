# Todo

State as of 2026-07-19. The curriculum is designed, lessons 01 to 03 are written and green
under the gate, and lesson 04 is next.

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
- Reference solutions in solutions/NN-slug/ mirror kid-edited files by relative path.
- Root `npm test` runs scripts/verify-lessons.mjs: asserts each lesson's shipped starter is
  RED and its solution copy is GREEN, staged in a temp dir. `npm run check` = typecheck +
  biome + that.
- Repo is public; no StackBlitz login needed.

## Done

- [x] Curriculum designed and written to refs/ (research-backed; sources cited in refs).
- [x] Lesson 01 fix-the-start, finished. The kid edits five values in src/exercise.ts and
      the preview marks itself PASS. Menu -> demo -> concepts -> build the room, hash-routed
      so a save-reload keeps the view. Card, wordbook, solution; green under npm run check.
- [x] Lesson 02 paint-the-L, finished. The kid writes a straight-line script of calls in
      src/exercise.ts and the preview replays it. Recording facade in src/harness/robot.ts.
      Try-the-calls console, then the L, then the door-follows payoff, then the card.
      Drills deferred to lesson 03 by rule; `argument` deferred with them.
- [x] Cards cut to 150 words and three terms, code-led. curriculum-structure.md rewritten
      short and prescriptive, pointing at lesson 02 as the shape to copy; design-lesson
      skill records the same.
- [x] Lesson 03 name-the-move, finished. The kid finishes the body of `paintShelf` in
      src/exercise.ts; the three calls and the joining `goToNextShelf` ship written, so one
      bug shows on all three shelves. `robot.walk(steps)` added to the facade, which is where
      `argument` arrives. The judge names the definition when the three shelves are wrong the
      same way, and names drift when the move does not come home. Taught part: nine presses
      for one shelf, then the same calls under one name, one press. Drills resume: five plus
      two overflow, no world. `parameter` and `return` live there, since no robot command
      takes or hands back a value. Card is read after the drills, so all three of its terms
      are words the kid has used.

## Next

- [ ] Lead teacher: open the lesson 02 link in a real browser. Confirm (a) the try-the-calls
      console advances one command per press and logs the call, (b) Paint the L replays the
      starter and reads "Good start: 2 of 5", (c) finishing the L turns the verdict green,
      shows the well-done banner and two PASS tiles from other doors, (d) the card renders.
- [ ] Lead teacher: open the lesson 01 link in a real browser. Confirm (a) menu shows,
      (b) demo Next walks still -> success -> failure -> Start Lesson 1, (c) Start Lesson 1
      shows concepts then Build the room, (d) resizing grid resizes live, (e) door-on-goal
      shows blue praise then robot-on-door flips to green PASS with the lesson-02 pointer.
- [ ] Lead teacher: open the lesson 03 link in a real browser. Confirm (a) the four call
      buttons move the robot and log one line each, (b) "Teach the robot this move" clears
      the board and leaves two buttons, and one press of `paintShelf();` paints a whole
      shelf, (c) Paint the shelves replays the starter and reads "Each shelf starts further
      along than the last", (d) finishing paintShelf turns the verdict green with two PASS
      tiles, (e) the card renders and the drills pointer reads before it.
- [ ] Lead teacher: work drill 02 the-broken-recipe in StackBlitz and confirm the editor
      underlines all three errors. Root `npm run check` cannot see it: the lesson tsconfig
      includes `src` only, on purpose, so a drill that must fail tsc does not fail the gate.
- [ ] Lesson 04 coin-flip door: conditionals. The first rung randomness forces, so a
      straight-line script stops being enough. Copy lesson 03's shape.
- [ ] Consider a README line for kids: keep the tab open or fork to save progress.
- [ ] Extract templates/lesson/ now that lessons 01 to 03 show what varies: index.html
      styles, markdown.ts, world.ts, types.ts are copied verbatim; task.ts and render.ts
      differ per lesson.

## Cut from lesson 01, and why

- Four drills plus overflow (predict / const-error / three-rooms / parking-spot). Each was
  "read the file, write the number over here": no work for the kid to do. Folding them into
  the lesson as a four-part stepper did not save them; the shape was the problem, not the
  packaging. Lesson 01 now ends at the capstone PASS.
- The post-PASS door-follows challenge: it belongs to lesson 02.
