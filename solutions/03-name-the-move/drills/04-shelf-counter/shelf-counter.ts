// Task 1: how many squares get painted, when every shelf is 3 long?
export function squares(shelves: number): number {
  return shelves * 3;
}

// Task 2: the same count, for shelves of any length.
export function squaresOf(shelves: number, length: number): number {
  return shelves * length;
}
