# What serious informatics curricula share

Principles distilled from curricula that teach programming through games and rule-governed
worlds without lowering the standard: the Russian school-informatics line (Ershov, KuMir,
olympiad training), the design-recipe line (HtDP, SICP), the studied game-themed CS1 courses
(Leutenegger, Sung, Bayliss), and the adult game-programming books of the Flash and canvas era
(Peters, Rosenzweig, van der Spuy). Sources at the end.

## 1. The concept is the deliverable; the game is the world

The game hosts the concept. It never replaces it. Successful courses keep the concept load
identical to a traditional course and change only the domain. Courses fail when the game is
garnish on an unchanged exercise: a reskinned print statement teaches printing, not games.

## 2. The world is formal

State has a written definition. Rules are functions. The win condition is machine-checkable.
Ershov's first programming environment gave students an executor -- a robot on a grid with
walls -- with exact preconditions and failure states, before variables were introduced. A small
formal world is easier to learn than a large informal one, because the student can hold all of
it in mind and every question about it has an answer.

## 3. The student owns pure functions; the harness owns everything else

The harness runs the loop, draws the screen, and handles input. The student writes functions
from state to value. This is not scaffolding to remove later; it is the final architecture.
HtDP's world programs, Sung's skeleton assignments, and every bot competition onboard this way.
The student's whole attention lands on the one thing being taught.

## 4. The judge is the authority

Automatic tests decide. Verdicts read PASS or FAIL, not praise. The student runs the judge
herself, as often as she likes, and the judge never tires. Olympiad training runs entirely on
this loop: attempt, verdict, revise. Red to green is the unit of progress.

## 5. Teach by problem ladder

A session is a chain of problems, each one step harder than the last, each solved by the
student. The teacher writes the ladder and stays out of the climb. Lecture is a last resort.
This is the mathematical-circle method applied to code.

## 6. Bugs must be visible

Render the state. A wrong function draws a wrong picture, and the student sees the bug without
being told. The visual channel is not decoration; it is the fastest feedback loop available,
and measured courses credit it for much of their gain.

## 7. One concept per step, in a fixed order

Values, then calling functions, then defining functions, then conditionals, then loops, then
arrays. Randomness comes early: it makes tiny programs interesting. Arrays wait for a board or
a tally to make them necessary. Nothing appears in an exercise before its lesson.

## 8. Claims get measured

A strategy is a claim. Verify it: run a thousand games and read the win rate. Simulation turns
loops and arrays into instruments, and it holds the student to the olympiad standard --
statements about programs are checked, not asserted.

## 9. Small in scope, never below the truth

Shrink the world, not the semantics. A two-rule game with exact rules teaches more than a
ten-rule game with fuzzy ones. Simplify by removing rules; never by blurring the rules that
remain.

## 10. Ship a working artifact on day one

The student starts from a program that already runs, and the first edit is one line with a
visible effect. Competitions onboard beginners this way without exception: working bot first,
strategy second. Nothing teaches faster than changing a thing that works.

## Sources

- Ershov's school informatics and KuMir executors: ershov.iis.nsk.su; Khenner and Semakin,
  "Information technology education in Russian schools."
- Olympiad training: Tsvetkova and Kiryukhin, Olympiads in Informatics 19 (2025);
  informatics.mccme.ru; Codeforces educational tracks.
- Circles: Fomin, Genkin, Itenberg, Mathematical Circles (Russian Experience), ch. 7 Games,
  ch. 12 Invariants.
- Design recipe: Felleisen et al., How to Design Programs (world programs, big-bang); Abelson
  and Sussman, SICP (state deferred to ch. 3).
- Game-themed CS1, measured: Leutenegger and Edgington, SIGCSE 2007; Sung et al., GDCSE 2008
  and SIGCSE 2009; Bayliss and Strout, SIGCSE 2006.
- Adult game-programming books: Peters, Making Things Move; Rosenzweig, ActionScript 3.0 Game
  Programming University; van der Spuy, Foundation Game Design.
- Bot as curriculum: Haverbeke, Eloquent JavaScript ch. 7 (A Robot); Robocode course papers;
  Battlesnake and CodinGame onboarding.
