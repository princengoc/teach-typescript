# Curriculum overview

Three acts. Twelve lessons live in this repo; the capstone lives in arpeggio.

## Act 1 -- Painter (lessons 1 to 10)

The language, learned in a robot world (painter-world.md). Values through arrays, one concept
per lesson, each lesson a card, drills, and a capstone rung. Rung 9 ends the act with a
measured claim: the kid's walker survives 100 random rooms. Lesson 10 is the summit for both
kids: reimplement the world's own `step` function. The blind navigator stays in reserve as a
challenge for whoever wants it.

## Act 2 -- Pig (two lessons, interleaved)

The oldest serious dice game: roll and grow the turn total, a 1 wipes it, hold to bank, first
to 50. A strategy is one function, `(state) => boolean` -- keep rolling? The judge is
statistical: win rate against hold-at-20 over a thousand seeded games. Claims get measured.

- Pig 1, after Painter lesson 4 or 5: the kid writes one-line strategies (`turnTotal < 20`,
  hold when `banked + turnTotal >= 50`) and watches the win rate move. The harness measures.
- Pig 2, after Painter lesson 9: the kid writes the measurement -- the tally, the win-rate
  loop. Simulation stops being harness magic and becomes their own code.

Pig enters exactly when a one-line strategy becomes writable, pays the "my function competes"
reward early, and returns when the kid can build the instrument themselves.

## Act 3 -- The arpeggio capstone (in the family repo)

Each kid implements their own strategy for arpeggio (arpeggio-project.md): a `decide` function
over a five-phase state, judged by the fast-check rubric -- coverage, extremes, breaks. New at
this point: the phase machine, pass and decline, two-digit candidates. Not new: reading typed
state, dispatch over a union, choosing among candidates, totality, and measuring a strategy.
The lessons taught the form; arpeggio demands the content.

Open work the capstone can absorb: Mai's WaitingForWhatYouWant, the descending player, and an
arena to play two strategies against each other -- the arena's game loop is the course's last
for loop.

## The sequence

| Order | Lesson | Concept |
| --- | --- | --- |
| 1 | Painter 1: fix the start | values |
| 2 | Painter 2: paint the L | calling functions |
| 3 | Painter 3: name the move | defining functions |
| 4 | Painter 4: coin-flip door | conditionals |
| 5 | Painter 5: walk to the wall | while |
| 6 | Pig 1: keep rolling? | strategy as a function |
| 7 | Painter 6: paint a row | for |
| 8 | Painter 7: the border | consolidation |
| 9 | Painter 8: read the board | arrays |
| 10 | Painter 9: measure the claim | simulation |
| 11 | Pig 2: build the instrument | tallies, win rates |
| 12 | Painter 10: write the machine | union, switch, totality |
| -- | Arpeggio capstone | everything, spent |

Both kids take every lesson in this order; speed may differ, the sequence does not
(curriculum-structure.md).

## The documents

- serious-informatics-teaching.md: the ten principles.
- curriculum-structure.md: lesson anatomy, card, drills, capstone; word map; outside
  practice. Lesson 02 is the reference implementation.
- painter-world.md: the world, the ladder, the harness boundary.
- arpeggio-project.md: what the capstone is and what it demands.
