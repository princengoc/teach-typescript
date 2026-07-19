# Todo

Lessons 01 to 04 built and green under `npm run check`. Lesson 05 is next.

## Next

- [ ] Lesson 05 walk-to-the-wall: `while`, `let`, counter. Room width unknown, so a fixed
      count crashes or stops short. `robot.wallAhead()` is the second sensor; lesson 04's
      live facade already supports it.
- [ ] Extract templates/lesson/. index.html styles, markdown.ts, render.ts, types.ts and
      world.ts are near-verbatim across all four lessons.
- [ ] Lesson 01 has no path from PASS to the drills (ideas.md).

## Lead teacher, in a real browser

- [ ] Lessons 01, 02, 03 previews. Criteria were in the lesson hand-backs.
- [ ] Lesson 04 preview: two rooms draw, the demo crashes one and passes the other, the
      sensor logs false/true, the starter fails on the left door, the else turns both tiles
      PASS however the coin lands, the card renders.
- [ ] Drill 02 of lessons 03 and 04: confirm the editor underlines all three errors.

## Do not relearn

- Lesson 04 made the robot facade live. Sensors need a real world, so the kid's code is a
  function that `runProgram` spends once per room, not a script that runs on import.
- Each lesson tsconfig includes `src` only, so a fix-the-compiler drill fails tsc without
  failing the gate.
- solutions/NN-slug/ mirrors kid-edited files by relative path, with every `test.skip` in
  the drills unskipped.
- refs/ holds the design: curriculum-overview (the arc), painter-world (the ladder),
  curriculum-structure (lesson anatomy, word map), serious-informatics-teaching (why).
