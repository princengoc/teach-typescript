// Task 1: every shelf is 3 squares long.
export function squaresIn(shelves: number): number {
  return shelves * 3;
}

// Task 2: 5 calls a shelf, plus 4 to travel between each pair of shelves.
export function pressesFor(shelves: number): number {
  return shelves * 5 + (shelves - 1) * 4;
}
