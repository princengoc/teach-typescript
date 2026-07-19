// Read these three functions. Do not run them.

export function isLong(squares: number): boolean {
  return squares > 4;
}

export function isExactly(squares: number, wanted: number): boolean {
  return squares === wanted;
}

export function isShort(squares: number): boolean {
  return !isLong(squares);
}

// Task 1: what does isLong(4) hand back? Write true or false.
export const answer1 = true;

// Task 2: what does isExactly(3, 3) hand back?
export const answer2 = false;

// Task 3: what does isShort(9) hand back?
export const answer3 = true;
