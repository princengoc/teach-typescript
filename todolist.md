# Todo

Lessons 01-07 built, green under `npm run check`, each with a preview and a
solutions deck. The robot has taught: read a field, call in order, name a move,
`if`/`else`, `let`/`+=`, `for`, recursion, and (07) a function that returns a
number the caller captures and spends.

## For the next agent: build lesson 08

Your job: design and build **lesson 08, "do the sum yourself"** (see its bullet
below for the concept and exercises). Then verify, commit, and pin.

- **How.** Invoke the `design-lesson` skill: frame Goal / Objective / Done-when,
  let the lead teacher edit the done-when, then build under `lessons/08-<slug>/`
  with a solution mirror at `solutions/08-<slug>/src/exercise.ts`.
- **Copy lesson 07 as the template.** `lessons/07-how-far/` is the newest, cleanest
  example of every harness file: `world.ts`, `robot.ts` (trimmed facade -- numbers
  are felt, not read), `render.ts` (draws walls as slate blocks), `task.ts`
  (Variant + factories + judge/judgeRung), `moves.ts` (given moves), `exercise.ts`
  (starter red / solution green), `main.ts` (hash-routed intro + rungs + card),
  `index.html`, `card.md`, `wordbook.md`, `README.md`.
- **Syntax the kid already has** (through `07-how-far/wordbook.md`): `return` a
  value, `: number`, `+ 1`/`- 1`, `+= 1`, `< > ===`, `!`, `if`/`else`, `let`,
  `for`, recursion, capture-a-value. Lesson 08 introduces the NEW tokens: `%`,
  general `+ - * /` on data, `<= >= !==`, and a function that returns a boolean.
  Introduce exactly one concept's worth; no arrays, no `while`.
- **Single-source rule (hard-won, keep it).** The picture and the world the
  robot runs against must come from ONE source. `render.ts` derives every
  dimension from the `World` it is handed; each rung reads one `Variant`; the
  intro reads numbers off the variant's `hidden` field. Never write a dimension
  literal twice, in code or in HTML prose -- the words must not drift from the
  pictures.
- **Scaffolding shrinks:** 08 asks more of the kid than 07.
- **Verify:** `npm run check` at repo root (typecheck + biome + `verify-lessons`
  asserting starter RED / solution GREEN), and `vite build` the lesson.
- **Commit and pin, ON MAIN.** Commit to `main`, not a feature branch:
  StackBlitz clones by commit SHA and can only resolve commits reachable from the
  default branch (we hit this and had to fast-forward `main`). After committing,
  pin the lesson's `README.md` StackBlitz link to the commit SHA on `main`, and
  add the lesson to `lessons/README.md`.

## Next robot lessons: the arc to the finale

Four lessons, each adding one strand of the finale's rope. The finale (10) is a
function that paints exactly the required cells of a `W x H` box whose
dimensions and required-marks are randomly generated per run: a nested grid
loop with a per-cell decision. 07 gives `return`; 08 adds compare/compute; 09
adds the grid; 10 braids them. Each lesson keeps a picture the kid watches, and
randomized rooms so a hard-coded answer cannot fake the render.

The overlaps are deliberate. `return` (07) is re-spent in 08 (return a boolean)
and 09 (returned counts bound the loops). The per-cell predicate (08) is the
decision reused inside 09's nested loop and in 10. 09's nested loop is the
finale's skeleton. Nobody meets an idea cold in 10.

- [x] **07 give a value back (`return`).** Built as `lessons/07-how-far/`. Three
      rungs, each forcing the return because the next move has nothing to feel:
      measure a gap and paint a floating row (spend once); a given `buildFirstBar`
      returns a height, match more bars where there is no ceiling (spend many);
      count a climb and lay a floor as long (produce in one pass, carry to
      another). Returning recursion, base case returns `1`, step `1 + call`; no
      `while`. Numbers are felt, not read.
- [ ] **08 do the sum yourself (compare and compute).** Operators on the kid's
      own values: comparison `< > === !==` and arithmetic `+ - * / %`, plus a
      function that returns a BOOLEAN. Exercises:
      - (C) per-cell yes/no `needsPaint(...) : boolean` -- returns a boolean
        from a comparison. Reinforces 07's `return` (now a boolean) and is the
        exact per-cell decision the finale leans on.
      - even/odd with `%` -- paint every other cell, a stripe the eye can check.
      - in-range, e.g. `value > lo && value < hi` -- paint only inside a band.
      Reuses `return` (07) and `if`/`else` (04). This is where return and
      compare meet.
- [ ] **09 the grid (list and nested loop).** A list (`for...of` over an array)
      and a nested `for` over rows x cols. Exercises:
      - paint a row of bars from `[3, 1, 4, 1, 5]` -- the list drives the
        picture, so copy-paste cannot win.
      - fill a `W x H` rectangle read from the room -- the nested grid walk, the
        finale's skeleton without the per-cell decision yet.
      Reuses `for` (06), returned counts as loop bounds (07), and can fold in
      08's predicate as the per-cell test.
- [ ] **10 robot finale.** Braid 07 + 08 + 09: nested grid loop, per-cell
      decision, over a random `W x H` box with random required cells. Their
      function must just work. Tall and satisfying; the payoff for the arc.

## After the robots

- [ ] **A handful of Exercism exercises.** Not a new syllabus -- a milestone. A
      short curated list on the TypeScript track that the robot lessons already
      cover, so the kid feels "I can do Exercism" and sees TypeScript is bigger
      than our room. Candidates once the three lessons above land: Two Fer,
      Leap, Raindrops, Collatz Conjecture, Reverse String. Vet each against what
      we have actually taught before listing it.
- [ ] **A cheatsheet, one page, in the kid's words.** No official TypeScript or
      MDN link -- neither is kid-navigable. List only what our exercises touch:
      read a field, last item of a list, `< > === !==`, `+ - * / %`,
      `Math.floor`, `return { ... }`. One line and one example each. Draft it
      once the exercise surface settles.
- [ ] **Arpeggio exercise series.** Red-to-green inside the real game. See the
      note in `ideas.md`.

## Loose ends

- [ ] Lesson 01 has no path from PASS to its drills (`ideas.md`).
- [ ] Confirm 05 and 06 previews render for the lead teacher in a real browser.

## Do not relearn

- Lesson 04 made the robot facade live. Sensors need a real world, so the kid's
  code is a function `runProgram` spends once per room, not a script that runs
  on import.
- Each lesson tsconfig includes `src` only, so a fix-the-compiler drill fails
  tsc without failing the gate.
- `solutions/NN-slug/` mirrors kid-edited files by relative path, with every
  `test.skip` in the drills unskipped.
- Each `lessons/NN/` is self-contained on purpose: StackBlitz clones the subtree,
  so a shared template would not travel. Duplicated `harness/` is the cost of
  cloning, not debt to pay down.
- `refs/` holds the design: curriculum-overview (the arc), painter-world (the
  ladder), curriculum-structure (lesson anatomy, word map),
  serious-informatics-teaching (why).
