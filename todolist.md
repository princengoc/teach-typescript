# Todo

Lessons 01-06 built, green under `npm run check`, each with a preview and a
solutions deck. The robot has taught: read a field, call in order, name a move,
`if`/`else`, `let`/`+=`, `for` and recursion. That is control flow, whole.

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

- [ ] **07 give a value back (`return`).** A function returns a value (a
      number), spent by its caller -- not `void`. New concept, exactly one: this
      is the biggest gap. Spine (A) measure-then-loop: a helper measures an
      unknown wall distance and returns the count; the caller spends it to bound
      a loop and paint the row. The sequel to 06's blind square -- there
      recursion DODGED naming the length; here the kid names it and returns it.
      Drill (B) count-the-climb, return it, walk home: a value one pass produces
      and another spends, so `return` is forced. Syntax floor: reuse recursion
      from 06, now returning a number not `void` -- do NOT introduce `while`.
      Keep `+= 1` (lesson 05); no new operators. Being designed now.
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
