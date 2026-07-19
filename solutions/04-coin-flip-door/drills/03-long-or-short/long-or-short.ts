// Task 1: more than 4 squares is long.
export function isLong(squares: number): boolean {
  return squares > 4;
}

// Task 2: fewer than 3 squares is short.
export function isShort(squares: number): boolean {
  return squares < 3;
}

// Task 3: neither long nor short. Use isLong and isShort.
export function isMiddling(squares: number): boolean {
  if (isLong(squares)) {
    return false;
  } else {
    return !isShort(squares);
  }
}
