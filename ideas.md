# Ideas

## Drill discoverability after lesson 1
- **What:** Once a kid passes lesson 1, there is no obvious way to reach the drills.
- **Why:** Drills reinforce the concept; if they are hard to find, kids skip them.
- **How:** TODO -- add a clear post-PASS path to the drills (link, button, or next-step banner).

## Arpeggio exercise series -- red-to-green inside the real game
- **What:** After the robots and the Exercism milestone, a series of scaffolded
  exercises in the arpeggio game itself. Same shape as the lessons: a stubbed
  function, a failing test, the kid makes it green. The green is a bot that
  plays a game they already know from the table.
- **Why:** The robot proves the syntax; arpeggio proves it was for something. A
  strategy is `decide(state) -> action`: read fields off a state, return a small
  action object. That is precisely `return`, object literals, comparison, and a
  list -- the exact foundations the last robot lessons add, now spent on a real
  program the kid has a stake in.
- **The ladder, easiest first, each a real strategy from `lesson9.md`:**
  - `ActNow!` / `Doubles!` -- pure `phase -> action`. `if` on a string, return
    an object literal, no arithmetic. Reachable straight after "give a value
    back".
  - `Perfect` / `PerfectFirstDigit` -- add comparison and arithmetic on the
    dice numbers.
  - The conservative ascending strategy (already written in `src/strategy.ts`) --
    reads the list, counts what is played, handles the break. The capstone.
- **The one real obstacle:** arpeggio is Deno (`Deno.test`, `jsr:`, `npm:`
  specifiers, `.ts` imports). StackBlitz WebContainers is Node, so the kid
  cannot clone the live repo the way they clone a lesson. Two ways out, decide
  later: vendor the small pure type surface (`GameState`, `StrategyAction`,
  `isLegalToAdd`, the dice helpers) into a Node/Vitest lesson package -- lowest
  risk, but the kid's code copies back to arpeggio by hand; or give arpeggio a
  Node/Vitest path so the real repo clones -- no copy-back, but it touches the
  live game.
- **Test shape:** the kid's rungs need concrete worked examples
  (`expect(decide(stateA)).toEqual({ kind: 'roll' })`), not arpeggio's existing
  property-based `strategy.test.ts`. Keep the property tests as a hidden floor
  the green must also clear, so a hard-coded answer fails.
- **Status:** note only. No lesson designed. Blocked on the last robot lessons
  landing first.
