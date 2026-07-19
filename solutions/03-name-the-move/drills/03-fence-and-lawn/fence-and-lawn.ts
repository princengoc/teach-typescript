// A square garden, `side` metres along each edge.

// Task 1: how many metres of fence go all the way round it?
export function fenceLength(side: number): number {
  return side * 4;
}

// Task 2: how many square metres of lawn are inside it?
export function lawnArea(side: number): number {
  return side * side;
}
