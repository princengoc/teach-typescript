// Task 1: how many walks does it take to cross a shelf this many squares long?
export function stepsBetween(squares: number): number {
  return squares - 1;
}

// Task 2: across and home again.
export function thereAndBack(squares: number): number {
  return stepsBetween(squares) * 2;
}
