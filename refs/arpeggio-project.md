# The arpeggio capstone

Arpeggio is the family game project at `~/gitfolders/arpeggio`. This curriculum exists so the
kids can complete their homework there: implement the strategies they invented. This document
records what arpeggio is and what the capstone demands. Lessons in this repo must not be
designed around arpeggio; they teach the concepts, and the capstone spends them.

## The game

Two players race to build a list of ten two-digit numbers, each digit 1 to 6. Player 1's list
must ascend, player 2's must descend. Each turn a player rolls two dice. The dice combine into
a two-digit number two ways: first-die-tens (`ab`) or reversed (`ba`). The player either plays
one combination onto their own list, following their direction, or passes the dice to the
opponent, who may accept or decline. On doubles, the roller may reroll one die. Each player may
break direction once per game. First to ten numbers wins.

## The code

Deno, plain TypeScript, no framework. Terminal UI. Pure functions over typed records; no
classes. Tests use `Deno.test` with fast-check property testing.

A strategy is one pure function:

```ts
decide(state: GameState): StrategyAction
```

`GameState` carries the phase (a five-case discriminated union: awaiting roll, awaiting reroll
choice, awaiting use-or-pass, awaiting pass response, game over), the dice, and both players'
lists. `StrategyAction` is a five-case union: roll, keep dice, use dice with an order choice,
pass, decline. `src/strategy.ts` holds the one existing implementation, an agent-written
version of JJ's conservative ascending strategy, as reference.

## The capstone

Each kid translates their own English strategy draft into a `decide` function. Drafts live in
arpeggio's `lesson9.md` and `drafts/`. Open work:

- Mai's WaitingForWhatYouWant: unimplemented.
- The descending player: unimplemented; the reference strategy throws on descending lists.
- No arena exists to play two strategies against each other.

## The bar

A strategy passes when it survives the property-test rubric already established in
`src/strategy.test.ts`:

1. Coverage: `decide` is total -- a legal action for every reachable state, no missing branch.
2. Extremes: sensible behavior across the full 11 to 66 range.
3. Breaks: never stuck because the break is already spent.

The kids' strategies face the same suite. Verdicts read PASS or FAIL.

## What the capstone requires of the curriculum

Reading nested typed state, boolean logic and comparisons, dispatch over a discriminated
union, choosing among candidates, and the discipline of a total function. Whatever world the
lessons use, they must leave the kids able to do these things unaided.
